const dns = require("dns");

// ========================================
// DNS CONFIGURATION
// ========================================

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

dns.setDefaultResultOrder("ipv4first");

console.log("🌐 Custom DNS configured");
console.log("🔥 THIS IS MY SERVER.JS");

// ========================================
// IMPORTS
// ========================================

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

const connectDB = require("./config/db");

// ========================================
// ROUTES
// ========================================

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const customerRoutes = require("./routes/customerRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const reportRoutes = require("./routes/reportRoutes");
const couponRoutes = require("./routes/couponRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

console.log("✅ All routes imported");

// ========================================
// EXPRESS APP
// ========================================

const app = express();

// ========================================
// CONNECT DATABASE
// ========================================

connectDB();

// ========================================
// UPLOAD DIRECTORY
// ========================================

const uploadsPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, {
    recursive: true,
  });

  console.log("📁 uploads folder created");
} else {
  console.log("📁 uploads folder exists");
}

// ========================================
// CORS
// ========================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ========================================
// BODY PARSER
// ========================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ========================================
// REQUEST LOGGER
// ========================================

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// ========================================
// STATIC UPLOAD FILES
// ========================================

app.use(
  "/uploads",
  express.static(uploadsPath)
);

// ========================================
// API ROUTES
// ========================================

// Products
app.use(
  "/api/products",
  productRoutes
);

// Authentication
app.use(
  "/api/auth",
  authRoutes
);

// Orders
app.use(
  "/api/orders",
  orderRoutes
);

// Dashboard
app.use(
  "/api/dashboard",
  dashboardRoutes
);

// Customers
console.log("Registering customer routes...");

app.use(
  "/api/customers",
  customerRoutes
);

console.log("✅ Customer routes registered");

// Invoice
app.use(
  "/api/invoice",
  invoiceRoutes
);

console.log("✅ Invoice routes registered");

// Reports
app.use(
  "/api/reports",
  reportRoutes
);

console.log("✅ Report routes registered");

// Coupons
app.use(
  "/api/coupons",
  couponRoutes
);

console.log("✅ Coupon routes registered");

// Payments
app.use(
  "/api/payments",
  paymentRoutes
);

console.log("✅ Payment routes registered");

// ========================================
// HOME ROUTE
// ========================================

app.get("/", (req, res) => {
  res.send(
    "🚀 General Karyana Store Backend is Running..."
  );
});

// ========================================
// TEST COUPON
// ========================================

app.get("/api/test-coupon", (req, res) => {
  res.json({
    success: true,
    message: "Coupon API Working",
  });
});

// ========================================
// TEST PAYMENT
// ========================================

app.get("/api/test-payment", (req, res) => {
  res.json({
    success: true,
    message: "Payment API Working",
  });
});

// ========================================
// TEST ROUTE
// ========================================

app.get("/test123", (req, res) => {
  res.send("TEST ROUTE WORKING");
});

// ========================================
// 404 HANDLER
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ========================================
// ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:");

  console.dir(err, {
    depth: null,
  });

  res.status(500).json({
    success: false,
    message:
      err.message || "Internal Server Error",
  });
});

// ========================================
// SERVER
// ========================================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log("========================================");
  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );
  console.log("📦 Products API: /api/products");
  console.log("🔐 Auth API: /api/auth");
  console.log("📦 Orders API: /api/orders");
  console.log("📊 Dashboard API: /api/dashboard");
  console.log("👥 Customers API: /api/customers");
  console.log("📄 Invoice API: /api/invoice");
  console.log("📈 Reports API: /api/reports");
  console.log("🎟️ Coupons API: /api/coupons");
  console.log("💳 Payments API: /api/payments");
  console.log("========================================");
});

// ========================================
// SERVER ERROR
// ========================================

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `❌ Port ${PORT} is already in use.`
    );
    console.error(
      "👉 Stop the previous server and start again."
    );
  } else {
    console.error("❌ Server Error:", error);
  }
});