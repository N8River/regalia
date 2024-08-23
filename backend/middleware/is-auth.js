const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  // console.log(req.headers);
  const token = req.headers.authorization?.split(" ")[1];
  // console.log("--------------------");
  // console.log(token);

  if (!token) return res.status(401).send("Access Denied");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log("Decoded token:", decoded);
    req.user = decoded;

    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
  // console.log(req.user);
};

exports.adminMiddleware = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).send("Access Denied");
  }
  next();
};
