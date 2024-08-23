const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../model/user");
const AuthController = require("../controller/auth");
const Middleware = require("../middleware/is-auth");
const validate = require("../middleware/validate");

const router = express.Router();

router.post("/signup", validate.validateUser, AuthController.signUp);

router.post("/login", validate.validateLogin, AuthController.login);

router.post("admin/login", validate.validateLogin, AuthController.adminLogin);

router.get("/profile", Middleware.authMiddleware, AuthController.getUserInfo);

module.exports = router;
