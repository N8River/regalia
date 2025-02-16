const Product = require("../model/product");
const mongoose = require("mongoose");
const { ContentState, convertFromRaw } = require("draft-js");
const { stateToHTML } = require("draft-js-export-html");

exports.getProducts = async (req, res, next) => {
  try {
    const { status, limit } = req.query; // Get status and limit from query params
    const query = status ? { status } : {}; // Filter by status if provided
    const productLimit = parseInt(limit) || 0; // Limit the number of products

    const products = await Product.find(query).limit(productLimit);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

exports.addProduct = async (req, res, next) => {
  const { title, imageUrl, price, description, category, status } = req.body;

  const product = new Product({
    title,
    imageUrl,
    price,
    description,
    category,
    status,
  });

  try {
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product" });
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Check if description is in Draft.js format
    try {
      const descriptionObj = JSON.parse(product.description);
      if (descriptionObj.blocks && descriptionObj.entityMap) {
        // Convert Draft.js JSON to HTML
        const contentState = convertFromRaw(descriptionObj);
        product.description = stateToHTML(contentState);
      }
    } catch (e) {
      // If parsing fails, assume description is a plain string and leave it as is
      console.log(
        "Description is not in Draft.js format, using it as plain text."
      );
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by Id: ", error);
    res.status(500).json({ message: "Failed fetching product by Id" });
  }
};

exports.editProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const { title, imageUrl, price, description, category, status } = req.body;

    const product = await Product.findByIdAndUpdate(
      productId,
      {
        title,
        imageUrl,
        price,
        description,
        category,
        status,
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error editing product: ", error);
    res.status(500).json({ message: "Failed editing product" });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed deleting product" });
  }
};

exports.searchProduct = async (req, res, next) => {
  const { q } = req.query;

  try {
    const products = await Product.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching search results" });
  }
};
