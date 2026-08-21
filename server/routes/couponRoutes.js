const express = require("express");

const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
} = require("../controllers/couponController");

const router = express.Router();

// Admin - Create Coupon
router.post("/", createCoupon);

// Admin - Get All Coupons
router.get("/", getAllCoupons);

// Admin - Update Coupon
router.put("/:id", updateCoupon);

// Admin - Delete Coupon
router.delete("/:id", deleteCoupon);

// Customer - Apply Coupon
router.post("/apply", applyCoupon);

module.exports = router;