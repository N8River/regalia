const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).send("Access Denied");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

exports.adminMiddleware = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).send("Access Denied");
  }
  next();
};
