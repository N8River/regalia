const express = require("express");

const router = express.Router();

const adminController = require("../controller/admin");

const middleware = require("../middleware/is-auth");

router.get("/orders/total", adminController.getTotalOrders);
router.get("/users/total", adminController.getTotalUsers);
router.get("/products/total", adminController.getTotalProducts);
router.get("/revenue/total", adminController.getTotalRevenue);
router.get("/orders/recent", adminController.getRecentOrders);

router.get(
  "/orders",
  middleware.authMiddleware,
  middleware.adminMiddleware,
  adminController.getAllOrders
);

// Admin - Update order status
router.put(
  "/orders/:orderId",
  middleware.authMiddleware,
  middleware.adminMiddleware,
  adminController.updateOrderStatus
);

router.get(
  "/users",
  middleware.authMiddleware,
  middleware.adminMiddleware,
  adminController.getUsersWithStats
);

router.get(
  "/users/stats",
  middleware.authMiddleware,
  middleware.adminMiddleware,
  adminController.getUserStats
);

router.get(
  "/products",
  middleware.authMiddleware,
  middleware.adminMiddleware,
  adminController.getProducts
);

router.post(
  "/add-product",
  middleware.authMiddleware,
  middleware.adminMiddleware,
  adminController.addProduct
);

router.put(
  "/products/:productId",
  middleware.authMiddleware,
  middleware.adminMiddleware,
  adminController.updateProduct
);

router.delete(
  "/products/:productId",
  middleware.authMiddleware,
  middleware.adminMiddleware,
  adminController.deleteProduct
);

module.exports = router;
