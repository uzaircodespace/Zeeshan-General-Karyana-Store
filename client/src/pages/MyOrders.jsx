import { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";

const orderSteps = [
  "Pending",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const { data } = await API.get("/orders/my");

      console.log("📦 MY ORDERS RESPONSE:", data);

      // Backend response ko safely array mein convert karo
      if (Array.isArray(data)) {
        setOrders(data);
      } else if (Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("❌ MY ORDERS ERROR:", error);
      console.error("Response:", error.response?.data);

      setOrders([]);

      toast.error(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-5">

      <h1 className="text-3xl font-bold mb-6">
        📦 My Orders
      </h1>

      {/* Loading */}
      {loading && (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">
            Loading orders...
          </p>
        </div>
      )}

      {/* No Orders */}
      {!loading && orders.length === 0 && (
        <div className="bg-gray-50 border rounded-lg p-8 text-center">
          <p className="text-gray-600 text-lg">
            No Orders Found.
          </p>
        </div>
      )}

      {/* Orders */}
      {!loading &&
        orders.length > 0 &&
        orders.map((order) => {

          const currentIndex =
            orderSteps.indexOf(order.status);

          return (
            <div
              key={order._id}
              className="border rounded-lg shadow-md p-5 mb-5 bg-white"
            >

              {/* Order ID */}
              <h2 className="font-bold text-xl mb-4">
                Order ID: {order._id}
              </h2>

              {/* Order Status */}
              <div className="mt-3">

                <p className="font-semibold mb-3">
                  Status:{" "}
                  <span className="text-blue-600">
                    {order.status || "Pending"}
                  </span>
                </p>

                {/* Cancelled */}
                {order.status === "Cancelled" ? (
                  <div className="bg-red-100 text-red-700 p-3 rounded-lg font-bold">
                    ❌ This order has been cancelled.
                  </div>
                ) : (
                  <div className="flex items-center justify-between overflow-x-auto gap-2">

                    {orderSteps.map((step, index) => (
                      <div
                        key={step}
                        className="flex flex-col items-center flex-1 min-w-[100px]"
                      >

                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                            index <= currentIndex
                              ? "bg-green-600"
                              : "bg-gray-300"
                          }`}
                        >
                          {index + 1}
                        </div>

                        <span className="text-sm mt-2 text-center">
                          {step}
                        </span>

                      </div>
                    ))}

                  </div>
                )}

              </div>

              {/* Payment Information */}
              <div className="mt-5 border-t pt-4">

                <p>
                  <strong>Payment Method:</strong>{" "}
                  {order.paymentMethod || "Cash on Delivery"}
                </p>

                <p className="mt-1">
                  <strong>Payment Status:</strong>{" "}

                  {order.paymentStatus === "Paid" ? (
                    <span className="text-green-600 font-bold">
                      ✅ Paid
                    </span>
                  ) : (
                    <span className="text-yellow-600 font-bold">
                      ⏳ Pending
                    </span>
                  )}
                </p>

                {order.transactionId && (
                  <p className="mt-1 break-all">
                    <strong>Transaction ID:</strong>{" "}
                    {order.transactionId}
                  </p>
                )}

              </div>

              {/* Total */}
              <p className="mt-4">
                <strong>Total:</strong>{" "}
                Rs {order.totalPrice}
              </p>

              {/* Address */}
              <p className="mt-1">
                <strong>Address:</strong>{" "}
                {order.address}
              </p>

              {/* Phone */}
              <p className="mt-1">
                <strong>Phone:</strong>{" "}
                {order.phone}
              </p>

              {/* Products */}
              <h3 className="mt-5 font-bold">
                Products
              </h3>

              <ul className="list-disc ml-6 mt-2">

                {Array.isArray(order.products) &&
                  order.products.map((item, index) => (
                    <li
                      key={
                        item.product?._id ||
                        `${order._id}-${index}`
                      }
                    >
                      {item.product?.name ||
                        "Product"}{" "}
                      × {item.quantity}
                    </li>
                  ))}

              </ul>

            </div>
          );
        })}

    </div>
  );
}

export default MyOrders;  