const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // =======================
    // User
    // =======================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =======================
    // Products
    // =======================
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: 1,
        },
      },
    ],

    // =======================
    // Total Price
    // =======================
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // =======================
    // Customer Address
    // =======================
    address: {
      type: String,
      required: true,
      trim: true,
    },

    // =======================
    // Customer Phone
    // =======================
    phone: {
      type: String,
      required: true,
      trim: true,
    },

    // =======================
    // Payment Method
    // =======================
    paymentMethod: {
      type: String,

      enum: [
        "Cash on Delivery",
        "JazzCash",
        "EasyPaisa",
      ],

      default: "Cash on Delivery",
    },

    // =======================
    // Payment Status
    // =======================
    paymentStatus: {
      type: String,

      enum: [
        "Pending",
        "Paid",
        "Failed",
      ],

      default: "Pending",
    },

    // =======================
    // Transaction ID
    // =======================
    transactionId: {
      type: String,
      default: "",
      trim: true,
    },

    // =======================
    // 🎟️ Coupon Code
    // =======================
    couponCode: {
      type: String,
      default: null,
      trim: true,
      uppercase: true,
    },

    // =======================
    // 💰 Coupon Discount
    // =======================
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // =======================
    // Order Status
    // =======================
    status: {
      type: String,

      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],

      default: "Pending",
    },
  },

  // =======================
  // Timestamps
  // =======================
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Order",
  orderSchema
);