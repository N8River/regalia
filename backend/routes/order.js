const express = require("express");
const router = express.Router();

const orderController = require("../controller/order");
const middleware = require("../middleware/is-auth");
const validate = require("../middleware/validate");

router.post(
  "/create-order",
  validate.validateOrder,
  middleware.authMiddleware,
  orderController.createOrder
);

router.get(
  "/fetch-order",
  middleware.authMiddleware,
  orderController.getOrders
);

router.get(
  "/fetch-order/:orderId",
  middleware.authMiddleware,
  orderController.getOrderById
);

module.exports = router;
