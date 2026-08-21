const Product = require("../models/Product");

// ===========================
// Get All Products
// ===========================

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("❌ GET PRODUCTS ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================
// Get Single Product
// ===========================

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("❌ GET PRODUCT ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================
// Add Product
// ===========================

const addProduct = async (req, res) => {
  try {
    console.log("\n========================================");
    console.log("🚀 PRODUCT ADD REQUEST");
    console.log("========================================");

    console.log("📦 REQUEST BODY:");
    console.dir(req.body, { depth: null });

    console.log("📸 REQUEST FILE:");
    console.dir(req.file, { depth: null });

    console.log("📋 CONTENT TYPE:");
    console.log(req.headers["content-type"]);

    // =========================
    // Get fields
    // =========================

    const {
      name,
      price,
      category,
      description,
      stock,
      rating,
    } = req.body;

    // =========================
    // Validate required fields
    // =========================

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price and category are required",
      });
    }

    // =========================
    // Validate image
    // =========================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    // =========================
    // Convert numbers
    // =========================

    const productPrice = Number(price);
    const productStock = Number(stock || 0);
    const productRating = Number(rating || 0);

    if (Number.isNaN(productPrice)) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid number",
      });
    }

    if (Number.isNaN(productStock)) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a valid number",
      });
    }

    if (Number.isNaN(productRating)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a valid number",
      });
    }

    // =========================
    // Create image URL
    // =========================

    const imageUrl = `/uploads/${req.file.filename}`;

    console.log("🖼 IMAGE URL:", imageUrl);

    // =========================
    // Product Data
    // =========================

    const productData = {
      name: String(name).trim(),

      price: productPrice,

      category: String(category).trim(),

      description: description
        ? String(description).trim()
        : "",

      stock: productStock,

      rating: productRating,

      image: imageUrl,
    };

    console.log("📦 PRODUCT DATA:");
    console.dir(productData, { depth: null });

    // =========================
    // Save Product
    // =========================

    const product = await Product.create(productData);

    console.log("========================================");
    console.log("✅ PRODUCT CREATED SUCCESSFULLY");
    console.log("Product ID:", product._id);
    console.log("Image:", product.image);
    console.log("========================================");

    return res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      product,
    });

  } catch (error) {
    console.log("\n========================================");
    console.log("❌ ADD PRODUCT ERROR");
    console.log("========================================");

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
      error: error.name || "UnknownError",
    });
  }
};

// ===========================
// Update Product
// ===========================

const updateProduct = async (req, res) => {
  try {
    console.log("\n========================================");
    console.log("✏️ UPDATE PRODUCT");
    console.log("========================================");

    console.log("ID:", req.params.id);

    console.log("BODY:");
    console.dir(req.body, { depth: null });

    console.log("FILE:");
    console.dir(req.file, { depth: null });

    // =========================
    // Update Data
    // =========================

    const updateData = {};

    if (req.body.name !== undefined) {
      updateData.name = String(req.body.name).trim();
    }

    if (req.body.category !== undefined) {
      updateData.category = String(
        req.body.category
      ).trim();
    }

    if (req.body.description !== undefined) {
      updateData.description = String(
        req.body.description
      ).trim();
    }

    // =========================
    // Numbers
    // =========================

    if (req.body.price !== undefined) {
      const price = Number(req.body.price);

      if (Number.isNaN(price)) {
        return res.status(400).json({
          success: false,
          message: "Price must be a valid number",
        });
      }

      updateData.price = price;
    }

    if (req.body.stock !== undefined) {
      const stock = Number(req.body.stock);

      if (Number.isNaN(stock)) {
        return res.status(400).json({
          success: false,
          message: "Stock must be a valid number",
        });
      }

      updateData.stock = stock;
    }

    if (req.body.rating !== undefined) {
      const rating = Number(req.body.rating);

      if (Number.isNaN(rating)) {
        return res.status(400).json({
          success: false,
          message: "Rating must be a valid number",
        });
      }

      updateData.rating = rating;
    }

    // =========================
    // New Image
    // =========================

    if (req.file) {
      const imageUrl =
        `/uploads/${req.file.filename}`;

      updateData.image = imageUrl;

      console.log(
        "🖼 NEW IMAGE URL:",
        imageUrl
      );
    }

    // =========================
    // Update Product
    // =========================

    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    console.log(
      "✅ PRODUCT UPDATED:",
      product._id
    );

    return res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      product,
    });

  } catch (error) {
    console.error(
      "❌ UPDATE PRODUCT ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================
// Delete Product
// ===========================

const deleteProduct = async (req, res) => {
  try {
    const product =
      await Product.findByIdAndDelete(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    console.log(
      "🗑 PRODUCT DELETED:",
      product._id
    );

    return res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });

  } catch (error) {
    console.error(
      "❌ DELETE PRODUCT ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===========================
// Export
// ===========================

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
};