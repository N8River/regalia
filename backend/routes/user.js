const express = require("express");
const router = express.Router();

const userController = require("../controller/user");
const middleware = require("../middleware/is-auth");
const validate = require("../middleware/validate");

router.get("/addresses", middleware.authMiddleware, userController.getAddress);

router.post(
  "/create-address",
  middleware.authMiddleware,
  validate.validateAddress,
  userController.addAddress
);

router.put(
  "/set-default-address/:addressId",
  middleware.authMiddleware,
  userController.setDefaultAddress
);

router.put(
  "/update-address/:addressId",
  middleware.authMiddleware,
  validate.validateAddress,
  userController.editAddress
);

router.delete(
  "/delete-address/:addressId",
  middleware.authMiddleware,
  userController.deleteAddress
);

module.exports = router;
