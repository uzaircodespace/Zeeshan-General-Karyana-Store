const express = require("express");

const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// ========================================
// PUBLIC ROUTES
// ========================================

// Get all products
router.get("/", getProducts);

// Get single product
router.get("/:id", getProductById);

// ========================================
// PROTECTED ROUTES
// ========================================

// Add Product
router.post(
  "/",
  protect,
  upload.single("image"),
  addProduct
);

// Update Product
router.put(
  "/:id",
  protect,
  upload.single("image"),
  updateProduct
);

// Delete Product
router.delete(
  "/:id",
  protect,
  deleteProduct
);

module.exports = router;