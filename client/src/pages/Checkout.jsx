import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { CartContext } from "../context/CartContext";
import API from "../api/api";

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // =======================
  // Customer Form
  // =======================

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "Cash on Delivery",
  });

  // =======================
  // Coupon
  // =======================

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  // =======================
  // Total Price
  // =======================

  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  // Final Total

  const finalTotal = Math.max(total - discount, 0);

  // =======================
  // Handle Input Change
  // =======================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =======================
  // Apply Coupon
  // =======================

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter coupon code");
      return;
    }

    try {
      const { data } = await API.post("/coupons/apply", {
        code: couponCode.trim().toUpperCase(),
        totalAmount: total,
      });

      setDiscount(Number(data.discount));
      setCouponApplied(true);

      toast.success(
        data.message || "Coupon applied successfully"
      );
    } catch (error) {
      console.error("❌ Coupon Error:", error);

      setDiscount(0);
      setCouponApplied(false);

      toast.error(
        error.response?.data?.message ||
          "Invalid coupon code"
      );
    }
  };

  // =======================
  // Remove Coupon
  // =======================

  const removeCoupon = () => {
    setCouponCode("");
    setDiscount(0);
    setCouponApplied(false);

    toast.info("Coupon removed");
  };

  // =======================
  // Place Order
  // =======================

  const placeOrder = async () => {
    console.log("================================");
    console.log("🛒 PLACE ORDER");
    console.log("================================");

    console.log("Cart:", cart);
    console.log("Customer Name:", form.name);
    console.log("Phone:", form.phone);
    console.log("Address:", form.address);
    console.log("Payment Method:", form.paymentMethod);
    console.log("Coupon:", couponCode);
    console.log("Original Total:", total);
    console.log("Discount:", discount);
    console.log("Final Total:", finalTotal);

    // =======================
    // Validation
    // =======================

    if (!form.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!form.phone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }

    if (!form.address.trim()) {
      toast.error("Please enter your delivery address.");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    // =======================
    // Products
    // =======================

    const products = cart.map((item) => ({
      product: item._id,
      quantity: Number(item.quantity),
    }));

    // =======================
    // Order Data
    // =======================

    const orderData = {
      products,

      totalPrice: finalTotal,

      address: form.address.trim(),

      phone: form.phone.trim(),

      paymentMethod: "Cash on Delivery",

      couponCode: couponApplied
        ? couponCode.trim().toUpperCase()
        : null,

      discountAmount: couponApplied
        ? discount
        : 0,
    };

    console.log("📦 FINAL ORDER DATA:");
    console.log(orderData);

    // =======================
    // Send Order
    // =======================

    try {
      const { data } = await API.post(
        "/orders",
        orderData
      );

      console.log("✅ ORDER RESPONSE:");
      console.log(data);

      toast.success(
        data.message || "Order placed successfully!"
      );

      // =======================
      // Clear Cart
      // =======================

      clearCart();

      // =======================
      // Go To Success Page
      // =======================

      navigate("/success");

    } catch (error) {
      console.error("❌ ORDER ERROR:", error);

      if (error.response) {
        console.error(
          "Status:",
          error.response.status
        );

        console.error(
          "Response:",
          error.response.data
        );
      }

      toast.error(
        error.response?.data?.message ||
          "Failed to place order."
      );
    }
  };

  // =======================
  // UI
  // =======================

  return (
    <section className="py-10 bg-gray-50 min-h-screen">

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">

        {/* ======================= */}
        {/* Heading */}
        {/* ======================= */}

        <h1 className="text-3xl font-bold text-center mb-8">
          🛒 Checkout
        </h1>

        {/* ======================= */}
        {/* Customer Information */}
        {/* ======================= */}

        <h2 className="text-xl font-bold mb-4">
          Customer Information
        </h2>

        {/* Name */}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
        />

        {/* Phone */}

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-4"
        />

        {/* Address */}

        <textarea
          name="address"
          placeholder="Delivery Address"
          value={form.address}
          onChange={handleChange}
          className="w-full border p-3 rounded mb-6"
          rows="4"
        />

        {/* ======================= */}
        {/* Payment Method */}
        {/* ======================= */}

        <div className="mb-8">

          <h2 className="text-xl font-bold mb-4">
            💳 Payment Method
          </h2>

          <label
            className="
              flex
              items-center
              gap-3
              border
              border-green-600
              bg-green-50
              rounded-lg
              p-4
              cursor-pointer
            "
          >

            <input
              type="radio"
              name="paymentMethod"
              value="Cash on Delivery"
              checked={
                form.paymentMethod ===
                "Cash on Delivery"
              }
              onChange={handleChange}
            />

            <span className="font-semibold">
              💵 Cash on Delivery
            </span>

          </label>

          <p className="text-sm text-gray-500 mt-2">
            Pay in cash when your order is delivered.
          </p>

        </div>

        {/* ======================= */}
        {/* Coupon Section */}
        {/* ======================= */}

        <div className="mb-8">

          <h2 className="text-xl font-bold mb-4">
            🎟️ Apply Coupon
          </h2>

          <div className="flex gap-3">

            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              disabled={couponApplied}
              onChange={(e) =>
                setCouponCode(
                  e.target.value.toUpperCase()
                )
              }
              className="flex-1 border p-3 rounded-lg"
            />

            {!couponApplied ? (

              <button
                type="button"
                onClick={applyCoupon}
                className="
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  px-6
                  rounded-lg
                  font-semibold
                "
              >
                Apply
              </button>

            ) : (

              <button
                type="button"
                onClick={removeCoupon}
                className="
                  bg-red-600
                  hover:bg-red-700
                  text-white
                  px-6
                  rounded-lg
                  font-semibold
                "
              >
                Remove
              </button>

            )}

          </div>

          {couponApplied && (

            <p className="text-green-600 font-semibold mt-3">
              ✅ Coupon "{couponCode}" Applied Successfully
            </p>

          )}

        </div>

        {/* ======================= */}
        {/* Order Summary */}
        {/* ======================= */}

        <div className="border-t pt-5 mb-6">

          {/* Subtotal */}

          <div className="flex justify-between text-lg mb-2">

            <span>
              Subtotal:
            </span>

            <span>
              Rs. {total}
            </span>

          </div>

          {/* Discount */}

          {discount > 0 && (

            <div className="flex justify-between text-lg text-green-600 mb-2">

              <span>
                Discount:
              </span>

              <span>
                - Rs. {discount}
              </span>

            </div>

          )}

          {/* Final Total */}

          <div
            className="
              flex
              justify-between
              text-2xl
              font-bold
              text-green-700
              mt-3
            "
          >

            <span>
              Total:
            </span>

            <span>
              Rs. {finalTotal}
            </span>

          </div>

        </div>

        {/* ======================= */}
        {/* Place Order Button */}
        {/* ======================= */}

        <button
          type="button"
          onClick={placeOrder}
          className="
            w-full
            bg-green-700
            text-white
            py-3
            rounded-lg
            hover:bg-green-800
            transition
            font-semibold
            text-lg
          "
        >
          🛍️ Place Order — Rs. {finalTotal}
        </button>

      </div>

    </section>
  );
}

export default Checkout;