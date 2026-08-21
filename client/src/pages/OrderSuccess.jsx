import { Link, useLocation } from "react-router-dom";

function OrderSuccess() {
  const location = useLocation();

  const order = location.state?.order;

  const paymentMethod =
    location.state?.paymentMethod ||
    order?.paymentMethod ||
    "Cash on Delivery";

  const paymentStatus =
    location.state?.paymentStatus ||
    order?.paymentStatus ||
    "Pending";

  const transactionId =
    location.state?.transactionId ||
    order?.transactionId ||
    "";

  const isPaid = paymentStatus === "Paid";
  const isFailed = paymentStatus === "Failed";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-lg text-center">

        {/* ========================= */}
        {/* ICON */}
        {/* ========================= */}

        <div className="text-7xl mb-4">
          {isPaid ? "🎉" : isFailed ? "❌" : "⏳"}
        </div>

        {/* ========================= */}
        {/* HEADING */}
        {/* ========================= */}

        <h1
          className={`text-3xl md:text-4xl font-bold mb-3 ${
            isPaid
              ? "text-green-700"
              : isFailed
              ? "text-red-600"
              : "text-yellow-600"
          }`}
        >
          {isPaid
            ? "Order Placed Successfully!"
            : isFailed
            ? "Payment Failed"
            : "Order Placed - Payment Pending"}
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for shopping with Zeeshan General & Karyana Store.
        </p>

        {/* ========================= */}
        {/* ORDER INFORMATION */}
        {/* ========================= */}

        <div className="bg-white shadow-lg rounded-xl p-6 text-left">

          <div className="space-y-5">

            {/* Order ID */}

            {order?._id && (
              <div>
                <p className="text-gray-500 text-sm">
                  Order ID
                </p>

                <p className="font-semibold break-all">
                  {order._id}
                </p>
              </div>
            )}

            {/* Payment Method */}

            <div>
              <p className="text-gray-500 text-sm">
                Payment Method
              </p>

              <p className="font-bold text-lg">
                {paymentMethod}
              </p>
            </div>

            {/* Payment Status */}

            <div>
              <p className="text-gray-500 text-sm">
                Payment Status
              </p>

              {isPaid ? (
                <p className="text-green-600 font-bold text-lg">
                  ✅ Paid
                </p>
              ) : isFailed ? (
                <p className="text-red-600 font-bold text-lg">
                  ❌ Failed
                </p>
              ) : (
                <p className="text-yellow-600 font-bold text-lg">
                  ⏳ Pending
                </p>
              )}
            </div>

            {/* Transaction ID */}

            {transactionId && (
              <div>
                <p className="text-gray-500 text-sm">
                  Transaction ID
                </p>

                <p className="font-semibold break-all">
                  {transactionId}
                </p>
              </div>
            )}

            {/* Total */}

            {order?.totalPrice !== undefined && (
              <div>
                <p className="text-gray-500 text-sm">
                  Total Amount
                </p>

                <p className="text-2xl font-bold text-green-700">
                  Rs. {order.totalPrice}
                </p>
              </div>
            )}

          </div>

        </div>

        {/* ========================= */}
        {/* PENDING MESSAGE */}
        {/* ========================= */}

        {!isPaid && !isFailed && (
          <div className="mt-5 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
            ⏳ Your payment will remain pending until
            the payment gateway confirms the transaction.
          </div>
        )}

        {/* ========================= */}
        {/* BUTTONS */}
        {/* ========================= */}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">

          <Link
            to="/products"
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-semibold"
          >
            🛍 Continue Shopping
          </Link>

          <Link
            to="/my-orders"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            📦 My Orders
          </Link>

        </div>

      </div>

    </div>
  );
}

export default OrderSuccess;