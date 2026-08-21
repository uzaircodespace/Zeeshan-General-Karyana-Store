const Order = require("../models/Order");

// ========================================
// CREATE JAZZCASH PAYMENT
// ========================================

const createJazzCashPayment = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    // Required fields
    if (!amount || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Amount and Order ID are required",
      });
    }

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    // Temporary sandbox transaction reference
    const transactionRef = `JC-${Date.now()}`;

    console.log("=================================");
    console.log("💳 JAZZCASH PAYMENT CREATED");
    console.log("=================================");
    console.log("Amount:", numericAmount);
    console.log("Order ID:", orderId);
    console.log("Transaction Ref:", transactionRef);

    return res.status(200).json({
      success: true,
      transactionRef,
      amount: numericAmount,
      orderId,
      paymentMethod: "JazzCash",
      paymentStatus: "Pending",
      message:
        "JazzCash sandbox payment request created",
    });
  } catch (error) {
    console.error(
      "❌ JAZZCASH PAYMENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Payment creation failed",
    });
  }
};

// ========================================
// JAZZCASH CALLBACK
// ========================================

const jazzCashCallback = async (req, res) => {
  try {
    console.log("=================================");
    console.log("💳 JAZZCASH CALLBACK RECEIVED");
    console.log("=================================");

    console.log("Callback Data:", req.body);

    const {
      transactionId,
      orderId,
      status,
    } = req.body;

    if (!transactionId || !orderId) {
      return res.status(400).json({
        success: false,
        message:
          "Transaction ID and Order ID are required",
      });
    }

    // ----------------------------------------
    // IMPORTANT
    // ----------------------------------------
    // Callback data should be verified with
    // the real JazzCash gateway before marking
    // an order as Paid.
    //
    // For now this is SANDBOX/DEMO mode.
    // ----------------------------------------

    if (status !== "Paid") {
      return res.status(200).json({
        success: true,
        paymentStatus: "Pending",
        message:
          "Payment callback received but payment is not confirmed",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Mark payment as paid only when callback
    // explicitly reports Paid.
    order.paymentStatus = "Paid";
    order.transactionId = transactionId;

    await order.save();

    console.log(
      "✅ Payment marked as Paid:",
      order._id
    );

    return res.status(200).json({
      success: true,
      paymentStatus: "Paid",
      message: "Payment confirmed successfully",
    });
  } catch (error) {
    console.error(
      "❌ JAZZCASH CALLBACK ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Callback processing failed",
    });
  }
};

// ========================================
// VERIFY PAYMENT
// ========================================

const verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      transactionId,
    } = req.body;

    if (!orderId || !transactionId) {
      return res.status(400).json({
        success: false,
        message:
          "Order ID and Transaction ID are required",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ----------------------------------------
    // SANDBOX MODE
    // ----------------------------------------
    // Real JazzCash API verification should
    // happen here using merchant credentials.
    //
    // We do NOT automatically mark the payment
    // as Paid just because a transaction ID
    // exists.
    // ----------------------------------------

    return res.status(200).json({
      success: true,
      paymentStatus:
        order.paymentStatus || "Pending",
      transactionId:
        order.transactionId || transactionId,
      message:
        "Payment verification endpoint is ready",
    });
  } catch (error) {
    console.error(
      "❌ PAYMENT VERIFICATION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Payment verification failed",
    });
  }
};

// ========================================
// EXPORT
// ========================================

module.exports = {
  createJazzCashPayment,
  jazzCashCallback,
  verifyPayment,
};