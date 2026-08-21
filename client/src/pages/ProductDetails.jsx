import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

import API from "../api/api";
import { CartContext } from "../context/CartContext";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const { clearCart } = useContext(CartContext);

  const orderData = location.state?.orderData;
  const total = location.state?.total || 0;

  const [loading, setLoading] = useState(false);

  // =========================
  // Check Order Data
  // =========================

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Payment Information Not Found
          </h2>

          <button
            onClick={() => navigate("/checkout")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Back to Checkout
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // Payment Method
  // =========================

  const paymentMethod = orderData.paymentMethod;

  // =========================
  // Pay Now
  // =========================

  const handlePayment = async () => {
    try {
      setLoading(true);

      // =====================================
      // First create order
      // =====================================

      const orderResponse = await API.post(
        "/orders",
        {
          ...orderData,
          paymentStatus: "Pending",
          transactionId: "",
        }
      );

      const order = orderResponse.data.order;

      if (!order) {
        throw new Error("Order could not be created");
      }

      // =====================================
      // JazzCash
      // =====================================

      if (paymentMethod === "JazzCash") {
        const { data } = await API.post(
          "/payments/jazzcash/create",
          {
            amount: total,
            orderId: order._id,
          }
        );

        if (!data.success) {
          throw new Error(
            data.message || "JazzCash payment failed"
          );
        }

        toast.success(
          "JazzCash payment request created"
        );

        // Sandbox success simulation
        navigate("/payment-success", {
          state: {
            orderId: order._id,
            transactionId: data.transactionRef,
            paymentMethod: "JazzCash",
            amount: total,
          },
        });

        return;
      }

      // =====================================
      // EasyPaisa
      // =====================================

      if (paymentMethod === "EasyPaisa") {
        const transactionRef = `EP${Date.now()}`;

        toast.success(
          "EasyPaisa payment request created"
        );

        // Sandbox success simulation
        navigate("/payment-success", {
          state: {
            orderId: order._id,
            transactionId: transactionRef,
            paymentMethod: "EasyPaisa",
            amount: total,
          },
        });

        return;
      }

    } catch (error) {
      console.error(
        "❌ PAYMENT ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Payment failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white shadow-xl rounded-2xl w-full max-w-lg p-8">

        {/* Heading */}

        <h1 className="text-3xl font-bold text-center mb-8">
          💳 Payment
        </h1>

        {/* Payment Method */}

        <div className="bg-gray-50 rounded-xl p-5 mb-6">

          <h2 className="text-lg font-bold mb-4">
            Selected Payment Method
          </h2>

          {paymentMethod === "JazzCash" ? (
            <div className="text-green-600 text-xl font-bold">
              🟢 JazzCash
            </div>
          ) : (
            <div className="text-blue-600 text-xl font-bold">
              🔵 EasyPaisa
            </div>
          )}

        </div>

        {/* Amount */}

        <div className="border rounded-xl p-5 mb-6">

          <div className="flex justify-between text-lg">
            <span>
              Amount:
            </span>

            <span className="font-bold text-green-700">
              Rs. {total}
            </span>
          </div>

        </div>

        {/* Order Info */}

        <div className="bg-gray-50 rounded-xl p-5 mb-6">

          <p className="mb-2">
            <strong>Phone:</strong>{" "}
            {orderData.phone}
          </p>

          <p>
            <strong>Address:</strong>{" "}
            {orderData.address}
          </p>

        </div>

        {/* Pay Button */}

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`w-full text-white py-3 rounded-lg font-bold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading
            ? "Processing Payment..."
            : `Pay Rs. ${total}`}
        </button>

        {/* Back */}

        <button
          onClick={() => navigate("/checkout")}
          disabled={loading}
          className="w-full mt-3 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-100"
        >
          ← Back to Checkout
        </button>

      </div>

    </div>
  );
}

export default Payment;