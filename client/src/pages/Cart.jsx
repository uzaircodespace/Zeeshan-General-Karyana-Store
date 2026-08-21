import { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useContext(CartContext);

  // Total Price
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Remove Product
  const handleRemove = (item) => {
    removeFromCart(item._id);
    toast.error(`${item.name} removed from cart ❌`);
  };

  // Clear Cart
  const handleClearCart = () => {
    clearCart();
    toast.info("Cart cleared successfully 🧹");
  };

  return (
    <div className="max-w-5xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-6 text-center">
        🛒 Your Cart
      </h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          Cart is empty 🛒
        </p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item._id}
              className="border p-4 mb-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-semibold">
                  {item.name}
                </h3>

                <p>Price: Rs {item.price}</p>

                <p>Quantity: {item.quantity}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => increaseQuantity(item._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  +
                </button>

                <button
                  onClick={() => decreaseQuantity(item._id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  -
                </button>

                <button
                  onClick={() => handleRemove(item)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="mt-6 text-right">
            <h2 className="text-2xl font-bold mb-4">
              Total: Rs {total}
            </h2>

            <div className="flex justify-end gap-4">
              <button
                onClick={handleClearCart}
                className="bg-red-700 text-white px-5 py-2 rounded hover:bg-red-800"
              >
                🗑 Clear Cart
              </button>

              <Link
                to="/checkout"
                className="bg-green-700 text-white px-5 py-2 rounded hover:bg-green-800"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;