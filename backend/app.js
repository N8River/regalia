require("dotenv").config({ path: "../.env" });

const express = require("express");
const helmet = require("helmet");
const compression = require("compression");

const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const userRoutes = require("./routes/user");
const couponRoutes = require("./routes/coupon");
const adminRoutes = require("./routes/admin");
const chatbotRoutes = require("./routes/chatbot");

const app = express();

// Hide console logs in production
if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.warn = () => {};
}

console.log("NODE_ENV is:", process.env.NODE_ENV);

app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // Allow cookies (if needed)
    methods: "OPTIONS, GET, POST, PUT, PATCH, DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: "Too many requests from this IP, please try again later",
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/user", userRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/", limiter);

app.get("/", (req, res, next) => {
  res.send("Hello World!");
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log("Error connecting to MongoDB:", err));
