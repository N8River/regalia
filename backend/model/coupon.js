const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const couponSchema = new Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  minPurchaseAmount: { type: Number, required: true }, // Minimum cart value to apply coupon
});

module.exports = mongoose.model("Coupon", couponSchema);
