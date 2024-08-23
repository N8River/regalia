const { body, validationResult } = require("express-validator");

exports.validateProduct = [
  body("title").isString().notEmpty().withMessage("Product name is required"),
  body("imageUrl").isURL().withMessage("Image URL must be valid"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("description").isString().withMessage("Description must be a string"),
  body("category").isString().notEmpty().withMessage("Category is required"),
  body("status")
    .isIn(["trending", "new-arrival", "normal"])
    .withMessage('Status must be "trending", "new-arrival", or "normal"'),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validateUser = [
  body("firstName")
    .isString()
    .notEmpty()
    .withMessage("First Name is required")
    .trim()
    .escape(),

  body("lastName")
    .isString()
    .notEmpty()
    .withMessage("Last Name is required")
    .trim()
    .escape(),

  body("email")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail()
    .trim()
    .escape(),

  body("password")
    .isString()
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters long")
    .trim()
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validateLogin = [
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body("password").isString().notEmpty().withMessage("Password is required"),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validateCoupon = [
  body("code")
    .optional()
    .isString()
    .withMessage("Coupon code must be a string"),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validateAddress = [
  body("line1").isString().notEmpty().withMessage("Address Line 1 is required"),
  body("line2").optional().isString().withMessage("Address Line 2 is optional"),
  body("city").isString().notEmpty().withMessage("City is required"),
  body("state").isString().notEmpty().withMessage("State is required"),
  body("zip").isPostalCode("any").withMessage("Valid Zip code is required"),
  body("country").isString().notEmpty().withMessage("Country is required"),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validateOrder = [
  body("products")
    .isArray({ min: 1 })
    .withMessage("Products must be an array and contain at least one item."),
  body("products.*.product")
    .isMongoId()
    .withMessage("Product ID must be a valid MongoDB ID."),
  body("products.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer."),
  body("subTotal")
    .isFloat({ min: 0 })
    .withMessage("Subtotal must be a positive number."),
  body("address.line1")
    .isString()
    .notEmpty()
    .withMessage("Address Line 1 is required."),
  body("address.city").isString().notEmpty().withMessage("City is required."),
  body("address.state").isString().notEmpty().withMessage("State is required."),
  body("address.zip")
    .isString()
    .notEmpty()
    .withMessage("ZIP code is required."),
  body("address.country")
    .isString()
    .notEmpty()
    .withMessage("Country is required."),
  body("paymentMethod")
    .isIn(["cashOnDelivery", "card"])
    .withMessage('Payment method must be either "cashOnDelivery" or "card".'),
  body("cardDetails.cardNumber")
    .if(body("paymentMethod").equals("card"))
    .isCreditCard()
    .withMessage("Card number must be valid."),
  body("cardDetails.expiration")
    .if(body("paymentMethod").equals("card"))
    .isLength({ min: 5, max: 5 })
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/)
    .withMessage("Expiration date must be in MM/YY format."),
  body("cardDetails.securityCode")
    .if(body("paymentMethod").equals("card"))
    .isLength({ min: 3, max: 4 })
    .withMessage("Security code must be 3 or 4 digits."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.validateCart = [
  body("productId").isMongoId().withMessage("Invalid Product ID"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
