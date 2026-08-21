const User = require("../models/User");
const Order = require("../models/Order");

// =======================
// Get All Customers
// =======================
const getCustomers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    const customers = await Promise.all(
      users.map(async (user) => {
        const orders = await Order.find({ user: user._id });

        return {
          ...user.toObject(),
          totalOrders: orders.length,
          totalSpent: orders.reduce(
            (sum, order) => sum + order.totalPrice,
            0
          ),
        };
      })
    );

    res.json(customers);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// =======================
// Delete Customer
// =======================
const deleteCustomer = async (req, res) => {
  try {

    // Delete customer's orders
    await Order.deleteMany({
      user: req.params.id,
    });

    // Delete customer
    const customer = await User.findByIdAndDelete(
      req.params.id
    );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json({
      message: "Customer deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  getCustomers,
  deleteCustomer,
};