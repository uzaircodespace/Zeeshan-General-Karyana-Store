const express = require("express");

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// =========================
// User Routes
// =========================

// Place Order
router.post("/", protect, placeOrder);

// My Orders
router.get("/my", protect, getMyOrders);

// Update Payment Status
router.put(
  "/:id/payment",
  protect,
  updatePaymentStatus
);

// =========================
// Admin Routes
// =========================

// All Orders
router.get(
  "/",
  protect,
  admin,
  getAllOrders
);

// Update Order Status
router.put(
  "/:id",
  protect,
  admin,
  updateOrderStatus
);

module.exports = router;