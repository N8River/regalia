const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { addressSchema } = require("../model/user");

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    subTotal: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
    address: {
      type: addressSchema,
      required: true,
    },
    arrivingOn: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    finalTotal: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cashOnDelivery", "card"],
      required: true,
    },
    cardDetails: {
      cardNumber: { type: String },
      expiration: { type: String },
      securityCode: { type: String },
    },
    orderedOn: {
      type: String,
      required: true,
    },
    isMock: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
