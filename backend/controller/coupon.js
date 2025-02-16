const Coupon = require("../model/coupon");

exports.applyCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal } = req.body;

    const coupon = await Coupon.findOne({ code: code });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (cartTotal < coupon.minPurchaseAmount) {
      return res.status(400).json({
        message: `Minimum purchase amount for this coupon is ${coupon.minPurchaseAmount}`,
      });
    }

    const discount = ((cartTotal * coupon.discount) / 100).toFixed(2);

    res
      .status(200)
      .json({ discount: coupon.discount, discountAmount: discount });
    console.log(res.json());
  } catch (error) {
    console.log("Error checking the coupon:", error);
  }
};
