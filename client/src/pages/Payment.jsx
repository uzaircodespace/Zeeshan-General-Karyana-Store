import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

import API from "../api/api";
import { CartContext } from "../context/CartContext";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const { clearCart } = useContext(CartContext);

  const [loading, setLoading] = useState(false);

  const state = location.state;

  // =========================
  // Invalid Payment Request
  // =========================
  if (!state || !state.orderData) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 text-center">
        <div className="bg-white shadow-lg rounded-xl p-8">

          <h1 className="text-2xl font-bold text-red-600">
            ❌ Invalid Payment Request
          </h1>

          <p className="text-gray-600 mt-3">
            No payment information was found.
          </p>

          <button
            type="button"
            onClick={() => navigate("/checkout")}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            ← Go Back to Checkout
          </button>

        </div>
      </div>
    );
  }

  const orderData = state.orderData;

  const total =
    Number(state.total) ||
    Number(orderData.totalPrice) ||
    0;

  // =========================
  // Start Payment
  // =========================
  const completePayment = async () => {
    try {
      setLoading(true);

      console.log("💳 Starting Payment...");
      console.log("📦 Order Data:", orderData);
      console.log("💰 Total:", total);

      // ==================================
      // Create Payment Request
      // ==================================

      const paymentRequest = {
        amount: total,
        paymentMethod: orderData.paymentMethod,
      };

      console.log(
        "💳 Payment Request:",
        paymentRequest
      );

      // ==================================
      // JazzCash
      // ==================================

      if (
        orderData.paymentMethod === "JazzCash"
      ) {
        const { data } = await API.post(
          "/payments/jazzcash/create",
          {
            amount: total,
            orderId: `ORDER-${Date.now()}`,
          }
        );

        console.log(
          "🟢 JazzCash Response:",
          data
        );

        if (!data.success) {
          throw new Error(
            data.message ||
              "JazzCash payment request failed"
          );
        }

        toast.info(
          "JazzCash payment request created."
        );

        /*
          IMPORTANT:

          This is currently sandbox/demo
          payment processing.

          Do NOT mark the order as Paid here.
        */

        await createPendingOrder(
          data.transactionRef
        );

        return;
      }

      // ==================================
      // EasyPaisa
      // ==================================

      if (
        orderData.paymentMethod ===
        "EasyPaisa"
      ) {
        toast.info(
          "EasyPaisa payment request created."
        );

        /*
          EasyPaisa gateway integration will
          be connected here after merchant
          credentials/API are configured.
        */

        await createPendingOrder(
          `EP-${Date.now()}`
        );

        return;
      }

      toast.error(
        "Invalid payment method."
      );

    } catch (error) {
      console.error(
        "❌ Payment Error:",
        error
      );

      console.error(
        "❌ Response:",
        error.response?.data
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Payment Failed"
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Create Pending Order
  // =========================
  const createPendingOrder = async (
    transactionId
  ) => {
    try {
      const pendingOrderData = {
        ...orderData,

        // NEVER mark Paid from frontend
        paymentStatus: "Pending",

        transactionId:
          transactionId || "",
      };

      console.log(
        "📦 Creating Pending Order:",
        pendingOrderData
      );

      const { data } = await API.post(
        "/orders",
        pendingOrderData
      );

      console.log(
        "✅ Pending Order Created:",
        data
      );

      toast.success(
        "Payment request created successfully."
      );

      /*
        Don't clear cart here.

        Cart should only be cleared after
        successful payment verification.
      */

      navigate("/success", {
        state: {
          order: data.order,
          paymentMethod:
            orderData.paymentMethod,
          transactionId,
          paymentStatus: "Pending",
        },
      });

    } catch (error) {
      console.error(
        "❌ Order Creation Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to create order"
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6">

      <h1 className="text-3xl font-bold mb-8 text-center">
        💳 Payment
      </h1>

      <div className="bg-white shadow-lg rounded-xl p-6">

        {/* Payment Method */}
        <div className="border-b pb-4 mb-4">

          <p className="text-lg">
            <strong>
              Payment Method:
            </strong>{" "}
            {orderData.paymentMethod}
          </p>

        </div>

        {/* Customer Information */}
        <div className="space-y-3">

          <p>
            <strong>Name:</strong>{" "}
            {orderData.name ||
              "Customer"}
          </p>

          <p>
            <strong>Phone:</strong>{" "}
            {orderData.phone}
          </p>

          <p>
            <strong>Address:</strong>{" "}
            {orderData.address}
          </p>

          <p className="text-2xl font-bold text-green-700">
            Total: Rs. {total}
          </p>

        </div>

        {/* Payment Information */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">

          {orderData.paymentMethod ===
          "JazzCash" ? (
            <>
              <h2 className="font-bold text-lg">
                🟢 JazzCash Payment
              </h2>

              <p className="text-gray-600 mt-2">
                Your JazzCash payment request
                will be created securely.
              </p>
            </>
          ) : (
            <>
              <h2 className="font-bold text-lg">
                🔵 EasyPaisa Payment
              </h2>

              <p className="text-gray-600 mt-2">
                Your EasyPaisa payment request
                will be created securely.
              </p>
            </>
          )}

        </div>

        {/* Security Notice */}
        <div className="mt-5 bg-yellow-50 border border-yellow-200 rounded-lg p-4">

          <p className="text-sm text-yellow-800">
            🔐 Payment will remain Pending until
            the payment gateway confirms the
            transaction.
          </p>

        </div>

        {/* Buttons */}
        <div className="mt-8 flex gap-4">

          <button
            type="button"
            disabled={loading}
            onClick={() =>
              navigate("/checkout")
            }
            className="w-1/2 bg-gray-500 hover:bg-gray-600 disabled:opacity-50 text-white py-3 rounded-lg"
          >
            ← Back
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={completePayment}
            className="w-1/2 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white py-3 rounded-lg font-semibold"
          >
            {loading
              ? "Processing..."
              : "💳 Continue Payment"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default Payment;