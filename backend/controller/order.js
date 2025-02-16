const Order = require("../model/order");
const User = require("../model/user");
const Cart = require("../model/cart");
const mongoose = require("mongoose");

exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    const orderDetails = req.body;

    const order = new Order({
      user: userId,
      products: orderDetails.products,
      subTotal: orderDetails.subTotal,
      address: orderDetails.address,
      arrivingOn: orderDetails.arrivingOn,
      discount: orderDetails.discount,
      discountAmount: orderDetails.discountAmount,
      deliveryCharge: orderDetails.deliveryCharge,
      finalTotal: orderDetails.finalTotal,
      paymentMethod: orderDetails.paymentMethod,
      cardDetails: orderDetails.cardDetails,
      orderedOn: orderDetails.orderedOn,
    });

    await order.save();

    // Clear the user's cart by setting items to an empty array and totalPrice to 0
    await Cart.findOneAndUpdate(
      { userId: userId },
      { items: [], totalPrice: 0 }
    );

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const order = await Order.find({ user: userId }).populate({
      path: "products",
      populate: {
        path: "product",
        model: "Product",
      },
    });

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;

    // Validate the orderId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID." });
    }

    const order = await Order.findById(orderId).populate({
      path: "products",
      populate: {
        path: "product",
        model: "Product",
      },
    });

    // Prevent unauthorized access
    if (!order || order.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.log("Error fetching order by id:", error);
  }
};
