const express = require("express");

const router = express.Router();
const cartController = require("../controller/cart");
const Middleware = require("../middleware/is-auth");
const validate = require("../middleware/validate");

router.post(
  "/",
  Middleware.authMiddleware,
  validate.validateCart,
  cartController.addToCart
);

router.get("/", Middleware.authMiddleware, cartController.getCart);

router.post(
  "/update",
  Middleware.authMiddleware,
  validate.validateCart,
  cartController.updateCart
);

router.get(
  "/cart-item-count",
  Middleware.authMiddleware,
  cartController.getCartItemCount
);

router.delete(
  "/:productId",
  Middleware.authMiddleware,
  cartController.deleteItem
);

module.exports = router;
