const express = require("express");
const router = express.Router();

const couponController = require("../controller/coupon");
const validate = require("../middleware/validate");

router.post("/validate", validate.validateCoupon, couponController.applyCoupon);

module.exports = router;
