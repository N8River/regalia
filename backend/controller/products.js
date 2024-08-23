const Product = require("../model/product");
const mongoose = require("mongoose");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

exports.addProduct = async (req, res, next) => {
  console.log("Requested Body:", req.body);
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
  console.log("🔴 Query", q);

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
