const express = require("express");

const router = express.Router();

const {
  createJazzCashPayment,
  jazzCashCallback,
  verifyPayment,
} = require("../controllers/paymentController");

// ========================================
// JAZZCASH CREATE PAYMENT
// ========================================

router.post(
  "/jazzcash/create",
  createJazzCashPayment
);

// ========================================
// JAZZCASH CALLBACK
// ========================================

router.post(
  "/jazzcash/callback",
  jazzCashCallback
);

// ========================================
// VERIFY PAYMENT
// ========================================

router.post(
  "/verify",
  verifyPayment
);

module.exports = router;