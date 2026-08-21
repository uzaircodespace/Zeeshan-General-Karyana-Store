const PDFDocument = require("pdfkit");
const Order = require("../models/Order");

const generateInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Invoice ID:", id);

    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("products.product", "name price");

    console.log("Order Found:", order);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${order._id}.pdf`
    );

    doc.pipe(res);


    // Header
    doc
      .fontSize(22)
      .text("Zeeshan General & Karyana Store", {
        align: "center",
      });

    doc.moveDown();


    // Customer Details
    doc.fontSize(16).text(`Invoice ID: ${order._id}`);

    doc.text(
      `Customer: ${
        order.user ? order.user.name : "Guest Customer"
      }`
    );

    doc.text(
      `Email: ${
        order.user ? order.user.email : "N/A"
      }`
    );

    doc.text(`Phone: ${order.phone || "N/A"}`);

    doc.text(`Address: ${order.address || "N/A"}`);

    doc.text(`Status: ${order.status}`);


    doc.moveDown();


    // Products
    doc.fontSize(18).text("Products");

    order.products.forEach((item) => {

      if (item.product) {

        const price =
          item.product.price * item.quantity;

        doc.text(
          `${item.product.name} x ${item.quantity} = Rs. ${price}`
        );

      } else {

        doc.text(
          `Product unavailable x ${item.quantity}`
        );

      }

    });


    doc.moveDown();


    // Total
    doc
      .fontSize(18)
      .text(`Total: Rs. ${order.totalPrice}`);


    doc.moveDown();


    doc
      .fontSize(12)
      .text("Thank you for shopping with us!", {
        align: "center",
      });


    doc.end();


  } catch (error) {

    console.log("INVOICE ERROR:", error.message);

    res.status(500).json({
      message: error.message,
    });

  }
};


module.exports = {
  generateInvoice,
};