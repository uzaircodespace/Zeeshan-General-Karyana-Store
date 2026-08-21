const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const Order = require("../models/Order");

// PDF Report
const exportPDF = async (req, res) => {
  const orders = await Order.find().populate("user", "name");

  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=Sales-Report.pdf"
  );

  doc.pipe(res);

  doc.fontSize(22).text("Sales Report", {
    align: "center",
  });

  doc.moveDown();

  orders.forEach((order) => {
    doc.text(
      `${order.user?.name} | Rs. ${order.totalPrice} | ${order.status}`
    );
  });

  doc.end();
};

// Excel Report
const exportExcel = async (req, res) => {
  const orders = await Order.find().populate("user", "name");

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Sales");

  sheet.columns = [
    { header: "Customer", key: "customer", width: 25 },
    { header: "Total", key: "total", width: 15 },
    { header: "Status", key: "status", width: 20 },
  ];

  orders.forEach((o) => {
    sheet.addRow({
      customer: o.user?.name,
      total: o.totalPrice,
      status: o.status,
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=Sales-Report.xlsx"
  );

  await workbook.xlsx.write(res);

  res.end();
};

module.exports = {
  exportPDF,
  exportExcel,
};