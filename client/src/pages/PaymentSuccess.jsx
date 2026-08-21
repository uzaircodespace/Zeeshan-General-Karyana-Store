import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import API from "../api/api";
import { CartContext } from "../context/CartContext";

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const { clearCart } = useContext(CartContext);

  const [processing, setProcessing] = useState(true);

  const paymentInfo = location.state;

  useEffect(() => {
    const completePayment = async () => {
      try {
        if (!paymentInfo?.orderId) {
          toast.error("Payment information not found.");
          navigate("/checkout");
          return;
        }

        // =========================
        // Payment Information
        // =========================

        console.log("💳 Payment Successful");
        console.log("Order ID:", paymentInfo.orderId);
        console.log(
          "Transaction ID:",
          paymentInfo.transactionId
        );
        console.log(
          "Payment Method:",
          paymentInfo.paymentMethod
        );

        // =========================
        // Update Payment Status
        // =========================

        await API.put(
          `/orders/${paymentInfo.orderId}/payment`,
          {
            paymentStatus: "Paid",
            transactionId:
              paymentInfo.transactionId,
          }
        );

        // =========================
        // Clear Cart
        // =========================

        clearCart();

        toast.success(
          "Payment completed successfully!"
        );
      } catch (error) {
        console.error(
          "❌ PAYMENT SUCCESS ERROR:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Payment verification failed."
        );
      } finally {
        setProcessing(false);
      }
    };

    completePayment();
  }, []);

  // =========================
  // Loading
  // =========================

  if (processing) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

        <div className="bg-white shadow-xl rounded-2xl p-10 text-center">

          <div className="text-5xl mb-5">
            ⏳
          </div>

          <h2 className="text-2xl font-bold mb-2">
            Processing Payment...
          </h2>

          <p className="text-gray-500">
            Please wait while we confirm your payment.
          </p>

        </div>

      </div>
    );
  }

  // =========================
  // Success Page
  // =========================

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white shadow-xl rounded-2xl w-full max-w-lg p-8 text-center">

        {/* Success Icon */}

        <div className="text-6xl mb-5">
          ✅
        </div>

        <h1 className="text-3xl font-bold text-green-600 mb-3">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mb-8">
          Your payment has been successfully processed.
        </p>

        {/* Payment Details */}

        <div className="bg-gray-50 rounded-xl p-5 text-left space-y-3 mb-8">

          <div className="flex justify-between">
            <span className="font-semibold">
              Order ID:
            </span>

            <span>
              {paymentInfo?.orderId?.slice(-8)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">
              Transaction ID:
            </span>

            <span className="break-all ml-4">
              {paymentInfo?.transactionId || "N/A"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">
              Payment Method:
            </span>

            <span>
              {paymentInfo?.paymentMethod}
            </span>
          </div>

          <div className="flex justify-between text-lg">
            <span className="font-bold">
              Amount:
            </span>

            <span className="font-bold text-green-700">
              Rs. {paymentInfo?.amount}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">
              Payment Status:
            </span>

            <span className="text-green-600 font-bold">
              ✅ Paid
            </span>
          </div>

        </div>

        {/* Buttons */}

        <div className="space-y-3">

          <button
            onClick={() => navigate("/my-orders")}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold"
          >
            📦 View My Orders
          </button>

          <button
            onClick={() => navigate("/products")}
            className="w-full border border-gray-300 hover:bg-gray-100 py-3 rounded-lg font-semibold"
          >
            🛍 Continue Shopping
          </button>

        </div>

      </div>

    </div>
  );
}

export default PaymentSuccess;