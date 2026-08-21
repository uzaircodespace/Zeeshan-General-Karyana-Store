const express = require("express");
const router = express.Router();

const {
  getCustomers,
  deleteCustomer,
} = require("../controllers/customerController");

const protect = require("../middleware/authMiddleware");

console.log("✅ customerRoutes Loaded");

router.use((req, res, next) => {
  console.log("CUSTOMER ROUTE HIT:", req.method, req.originalUrl);
  next();
});

// GET all customers
router.get("/", protect, getCustomers);

// DELETE customer
router.delete("/:id", protect, deleteCustomer);

module.exports = router;