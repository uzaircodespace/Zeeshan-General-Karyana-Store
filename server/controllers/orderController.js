const Order = require("../models/Order");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");

// =========================
// Place Order
// =========================
const placeOrder = async (req, res) => {
  try {
    const {
      products,
      totalPrice,
      address,
      phone,
      paymentMethod,
      transactionId,
      couponCode,
    } = req.body;

    // =========================
    // Check Products
    // =========================
    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products found in order",
      });
    }

    // =========================
// COD ONLY
// =========================

if (paymentMethod !== "Cash on Delivery") {
  return res.status(400).json({
    success: false,
    message: "Only Cash on Delivery is available",
  });
}

    // =========================
    // Check Address & Phone
    // =========================
    if (!address || !phone) {
      return res.status(400).json({
        success: false,
        message: "Address and phone are required",
      });
    }

    // =========================
    // Check Stock + Calculate Original Total
    // =========================
    let originalTotal = 0;

    for (const item of products) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }

      originalTotal +=
        Number(product.price) * Number(item.quantity);
    }

    // =========================
    // Coupon Variables
    // =========================
    let finalCouponCode = null;
    let finalDiscountAmount = 0;

    // =========================
    // Validate Coupon
    // =========================
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
      });

      // Coupon exists?
      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: "Invalid coupon code",
        });
      }

      // Active?
      if (!coupon.isActive) {
        return res.status(400).json({
          success: false,
          message: "Coupon is inactive",
        });
      }

      // Expired?
      if (new Date() > new Date(coupon.expiryDate)) {
        return res.status(400).json({
          success: false,
          message: "Coupon has expired",
        });
      }

      // Usage limit
      if (
        coupon.usageLimit > 0 &&
        coupon.usedCount >= coupon.usageLimit
      ) {
        return res.status(400).json({
          success: false,
          message: "Coupon usage limit reached",
        });
      }

      // Minimum order amount
      if (
        originalTotal <
        Number(coupon.minimumOrderAmount || 0)
      ) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount is Rs. ${coupon.minimumOrderAmount}`,
        });
      }

      // =========================
      // Calculate Discount
      // =========================
      let calculatedDiscount = 0;

      if (coupon.discountType === "percentage") {
        calculatedDiscount =
          (originalTotal *
            Number(coupon.discountValue)) /
          100;
      } else {
        calculatedDiscount =
          Number(coupon.discountValue);
      }

      // Discount cannot exceed original total
      calculatedDiscount = Math.min(
        calculatedDiscount,
        originalTotal
      );

      finalCouponCode = coupon.code;
      finalDiscountAmount = calculatedDiscount;
    }

    // =========================
    // Calculate Final Total
    // =========================
    const calculatedFinalTotal =
      originalTotal - finalDiscountAmount;

    // =========================
    // Verify Price
    // =========================
    if (
      Number(totalPrice).toFixed(2) !==
      Number(calculatedFinalTotal).toFixed(2)
    ) {
      return res.status(400).json({
        success: false,
        message: "Order total does not match server calculation",
      });
    }

    // =========================
// Payment Status
// =========================
// =========================
// Payment Status - COD ONLY
// =========================

const finalPaymentStatus = "Pending";

    // =========================
    // Create Order
    // =========================
    const order = await Order.create({
      user: req.user.id,

      products,

      totalPrice: Number(totalPrice),

      address,

      phone,

      paymentMethod,

      paymentStatus: finalPaymentStatus,


      couponCode: finalCouponCode,

      discountAmount: finalDiscountAmount,

      status: "Pending",
    });

    // =========================
    // Increase Coupon Usage
    // =========================
    if (finalCouponCode) {
      await Coupon.findOneAndUpdate(
        {
          code: finalCouponCode,
        },
        {
          $inc: {
            usedCount: 1,
          },
        }
      );
    }

    // =========================
    // Reduce Stock
    // =========================
    for (const item of products) {
      const product = await Product.findById(
        item.product
      );

      if (product) {
        product.stock -= Number(item.quantity);

        await product.save();
      }
    }

    // =========================
    // Response
    // =========================
    res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
      order,
    });
  } catch (error) {
    console.error(
      "PLACE ORDER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// My Orders
// =========================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("products.product")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "GET MY ORDERS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// All Orders - Admin
// =========================
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "GET ALL ORDERS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Update Order Status
// =========================
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order Status Updated Successfully",
      order,
    });
  } catch (error) {
    console.error(
      "UPDATE ORDER STATUS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Update Payment Status
// =========================
const updatePaymentStatus = async (req, res) => {
  try {
    const {
      paymentStatus,
      transactionId,
    } = req.body;

    // =========================
    // Validate Payment Status
    // =========================
    const allowedPaymentStatuses = [
      "Pending",
      "Paid",
      "Failed",
    ];

    if (
      !allowedPaymentStatuses.includes(
        paymentStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    // =========================
    // Find Order
    // =========================
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    }

    // =========================
    // Security:
    // User can only update
    // their own order
    // =========================
    if (
      order.user.toString() !==
      req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // =========================
    // Update Payment
    // =========================
    order.paymentStatus =
      paymentStatus;

    if (transactionId) {
      order.transactionId =
        transactionId;
    }

    await order.save();

    res.status(200).json({
      success: true,
      message:
        "Payment Status Updated Successfully",
      order,
    });
  } catch (error) {
    console.error(
      "UPDATE PAYMENT STATUS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Export
// =========================
module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
};