const express = require("express");
// const Product = require("../model/product");

const router = express.Router();
const productController = require("../controller/products");
const validate = require("../middleware/validate");

router.get("/", productController.getProducts);

router.post("/", validate.validateProduct, productController.addProduct);

router.get("/search", productController.searchProduct);

router.get("/:productId", productController.getProductById);

router.put(
  "/:productId",
  validate.validateProduct,
  productController.editProduct
);

router.delete("/:productId", productController.deleteProduct);

module.exports = router;
