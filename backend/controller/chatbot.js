const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../model/product");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const cache = new Map();

const MAX_INPUT_LENGTH = 500;

const extractFiltersWithAI = async (message) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemPrompt = `
  Extract structured filters from the user message related to product recommendations. 
  If the user is NOT requesting a product recommendation (e.g., asking about materials, refund policies), set "isProductQuery" to false.
  
  Your response should be a valid JSON object:
  - category: "rings" | "bracelets" | "chains" | "earrings" | null
  - material: "gold" | "silver" | "plated" | null
  - lowerLimit: Integer (minimum price) | 0 if unspecified
  - upperLimit: Integer (maximum price) | 999999 if unspecified
  - outfitMatching: Boolean (true if the user wants a recommendation based on an outfit)
  - isProductQuery: Boolean (true if the query is related to finding a product, false otherwise)
  - isTrendy: Boolean (true if the user is looking for a "trendy" item)


  **Examples**
  User: "Suggest a trendy silver ring under 1500 rupees."
  Response:
  {
    "category": "rings",
    "material": "silver",
    "lowerLimit": 0,
    "upperLimit": 1500,
    "outfitMatching": false,
    "isProductQuery": true,
    "isTrendy": true
  }

  User: "What materials do you use?"
  Response:
  {
    "category": null,
    "material": null,
    "lowerLimit": 0,
    "upperLimit": 999999,
    "outfitMatching": false,
    "isProductQuery": false
  }

  **Response Format:** Return only the JSON object. No extra text, no markdown.
  `;

  const result = await model.generateContent({
    contents: [{ parts: [{ text: systemPrompt }, { text: message }] }],
  });

  try {
    let extractedText = result?.response?.text()?.trim();

    // **Fix:** Remove Markdown-style triple backticks if present
    extractedText = extractedText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const extractedFilters = JSON.parse(extractedText);

    return extractedFilters;
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return { isProductQuery: false }; // Default to non-product queries
  }
};

const fetchJewelryMaterials = async (filters, maxRecommendations = 5) => {
  if (!filters.isProductQuery) return null; // **Skip product fetch if it's not a product query.**

  try {
    const query = {};
    if (filters.category) {
      query.category = new RegExp(`^${filters.category}s?$`, "i");
    }
    if (filters.material) {
      query.description = new RegExp(filters.material, "i");
    }
    query.price = { $gte: filters.lowerLimit, $lte: filters.upperLimit };

    let products = await Product.find(query, "title category price _id status");

    if (filters.isTrendy) {
      products = products.filter((p) => p.status === "trending");
    }

    return {
      totalProducts: products.length,
      filteredProducts: products.slice(0, maxRecommendations).map((p) => ({
        title: p.title,
        price: p.price,
        category: p.category,
        productId: p._id.toString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching product data:", error);
    return null;
  }
};

const generateAIResponse = async (message, productData, history = []) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemPrompt = `
  You are Regalia's AI-powered assistant. Maintain **context** from previous messages to ensure a smooth conversation.
  If product recommendations exist, mention them concisely, but DO NOT include full details or links. And do not use asterisks around the product you're recommending.
  The minimum amount to get free delivery is 500 rupees, EVERYTHING IS INR NOT DOLLARS. 
  Refund Policy is 10 days.

  **Rules:**
  - If the user asks for more options, refine the search rather than restarting.
  - If productData.totalProducts > 0, always recommend something.
  - If productData.totalProducts == 0, say: "Currently, we don't have that option."

  **Conversation History:**
  ${history.map((h) => `User: ${h.text}`).join("\n")}

  **Previous AI Response:** ${
    history.length > 0 ? history[history.length - 1].text : "None"
  }

  **New User Message:** ${message}

  **Available Product Data:** ${JSON.stringify(productData)}
  `;

  const MAX_HISTORY = 10;
  const historyParts = history.slice(-MAX_HISTORY).map((h) => ({ text: h }));

  try {
    const result = await model.generateContent({
      contents: [
        { parts: [{ text: systemPrompt }, ...historyParts, { text: message }] },
      ],
    });

    return (
      result?.response?.text()?.trim() ||
      "I'm here to help! What are you looking for?"
    );
  } catch (error) {
    console.error("AI Response Error:", error);
    return "I'm having trouble processing this request. Please try again.";
  }
};

const sanitizeUserInput = (input) => {
  return input.trim().replace(/[\u200B-\u200D\uFEFF]/g, ""); // Remove zero-width spaces
};

const containsInjectionAttempt = (input) => {
  const lowerInput = input.toLowerCase();
  return (
    lowerInput.includes("ignore all previous instructions") ||
    lowerInput.includes("forget everything") ||
    lowerInput.includes("system:") ||
    lowerInput.includes("reset") ||
    lowerInput.includes("assistant:") // Prevents reprogramming attempts
  );
};

const generateGeneralAIResponse = async (message) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const systemPrompt = `
  You are Regalia's AI assistant. Answer general customer questions concisely. 
  If the question is about refunds, shipping, or materials, provide a clear response. 
  Do not recommend products unless explicitly asked.
  The minimum amount to get free delivery is 500 rupees, EVERYTHING IS INR NOT DOLLARS. 

  Example:
  User: "What materials do you use?"
  Response: "We use high-quality sterling silver, gold plating, and various gemstones in our jewelry."

  User: "What is your refund policy?"
  Response: "You can return products within 10 days of delivery for a full refund."

  **Question:** ${message}
  `;

  const result = await model.generateContent({
    contents: [{ parts: [{ text: systemPrompt }] }],
  });

  return (
    result?.response?.text()?.trim() || "I'm here to help! What do you need?"
  );
};

exports.getChatResponse = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    const sanitizedMessage = sanitizeUserInput(message);

    if (containsInjectionAttempt(sanitizedMessage)) {
      return res.status(400).json({ response: "Invalid input detected." });
    }

    if (sanitizedMessage.length > MAX_INPUT_LENGTH) {
      return res
        .status(400)
        .json({ response: "Your request is too long. Please simplify it." });
    }

    const filters = await extractFiltersWithAI(sanitizedMessage);

    let responseText;
    let recommendations = [];

    if (!filters.isProductQuery) {
      responseText = await generateGeneralAIResponse(sanitizedMessage);
    } else {
      const productData = await fetchJewelryMaterials(filters);

      if (productData && productData.totalProducts > 0) {
        responseText = await generateAIResponse(
          sanitizedMessage,
          productData,
          history
        );
        recommendations = productData.filteredProducts;
      } else {
        responseText = "Currently, we don't have that option.";
      }
    }

    res.status(200).json({ response: responseText, recommendations });
  } catch (error) {
    console.error("Error generating chatbot response:", error);
    res.status(500).json({
      message: "Failed to generate response. Please try again later.",
    });
  }
};
