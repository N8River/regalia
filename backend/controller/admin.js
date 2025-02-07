const Order = require("../model/order");
const User = require("../model/user");
const Product = require("../model/product");
const mongoose = require("mongoose");

// Fetch total number of orders
exports.getTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json(totalOrders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch total orders", error });
  }
};

// Fetch total number of users
exports.getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json(totalUsers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch total users", error });
  }
};

// Fetch total number of products
exports.getTotalProducts = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    res.json(totalProducts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch total products", error });
  }
};

// Fetch total revenue
exports.getTotalRevenue = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalRevenue = orders.reduce(
      (acc, order) => acc + order.finalTotal,
      0
    );
    res.json(totalRevenue);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch total revenue", error });
  }
};

// Fetch recent orders (5)
exports.getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 }) // Sort by latest order
      .limit(5) // Limit to the last 5
      .populate("user", "firstName lastName") // Populate user details (first and last name)
      .exec();

    res.json(recentOrders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recent orders", error });
  }
};

// Fetch all orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query; // Query params for pagination and filtering
    const query = status ? { status } : {}; // Filter by status if provided

    const orders = await Order.find(query)
      .populate("user", "firstName lastName email") // Populates user details for each order
      .populate({
        path: "products.product",
        model: "Product",
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 }); // Sort by most recent

    const totalOrders = await Order.countDocuments(query);
    res.status(200).json({
      orders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

// Fetch users with order stats
exports.getUsersWithStats = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Query params for pagination

    // Count total number of users
    const totalUsers = await User.countDocuments();

    // Aggregate user information with order stats
    const users = await User.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "user",
          as: "orders",
        },
      },
      {
        $addFields: {
          ordersCount: { $size: "$orders" },
          totalSpent: { $sum: "$orders.finalTotal" },
        },
      },
      {
        $addFields: {
          averageOrderValue: {
            $cond: {
              if: { $gt: ["$ordersCount", 0] },
              then: { $divide: ["$totalSpent", "$ordersCount"] },
              else: 0,
            },
          },
          lastOrderDate: { $max: "$orders.orderedOn" },
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          ordersCount: 1,
          totalSpent: 1,
          averageOrderValue: 1,
          lastOrderDate: 1,
        },
      },
      { $skip: (page - 1) * limit }, // Pagination: skip the appropriate number of records
      { $limit: parseInt(limit) }, // Pagination: limit the number of records returned
    ]);

    // Count active/inactive users
    const activeUsers = users.filter((user) => user.ordersCount > 0).length;
    const inactiveUsers = totalUsers - activeUsers;

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json({
      users,
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalPages: Math.ceil(totalUsers / limit), // Calculate total pages
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Failed to fetch user stats" });
  }
};

// Fetch overall stats without pagination
exports.getUserStats = async (req, res) => {
  try {
    // Count total number of users
    const totalUsers = await User.countDocuments();

    // Aggregate user information with order stats
    const allUsers = await User.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "user",
          as: "orders",
        },
      },
      {
        $addFields: {
          ordersCount: { $size: "$orders" },
        },
      },
    ]);

    const activeUsers = allUsers.filter((user) => user.ordersCount > 0).length;
    const inactiveUsers = totalUsers - activeUsers;

    res.status(200).json({
      totalUsers,
      activeUsers,
      inactiveUsers,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Failed to fetch user stats" });
  }
};

// Fetch all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// Add a product
exports.addProduct = async (req, res) => {
  try {
    const { title, category, price, status, imageUrl, description } = req.body;
    const newProduct = new Product({
      title,
      category,
      price,
      status,
      imageUrl,
      description,
    });
    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Failed to add product" });
  }
};

// Edit a product
exports.updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { title, category, price, status, imageUrl, description } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        title,
        category,
        price,
        status,
        imageUrl,
        description,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};
