console.log("✅ invoiceRoutes.js loaded");
const express = require("express");
const { generateInvoice } = require("../controllers/invoiceController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Test Route
router.get("/test", (req, res) => {
  res.send("Invoice Route Working ✅");
});

// Download Invoice
router.get("/:id", protect, generateInvoice);

module.exports = router;