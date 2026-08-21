const express = require("express");
const {
  exportPDF,
  exportExcel,
} = require("../controllers/reportController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/pdf", protect, exportPDF);
router.get("/excel", protect, exportExcel);

module.exports = router;