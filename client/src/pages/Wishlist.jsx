import { useContext } from "react";
import { toast } from "react-toastify";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";

function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart 🛒`);
  };

  const handleRemove = (product) => {
    removeFromWishlist(product.id);
    toast.error(`${product.name} removed from wishlist ❤️`);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        ❤️ My Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          Your wishlist is empty.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg p-5 text-center"
            >
              <div className="text-6xl">{product.image}</div>

              <h2 className="text-xl font-bold mt-4">
                {product.name}
              </h2>

              <p className="text-gray-500">
                {product.category}
              </p>

              <p className="text-green-700 font-semibold mt-2">
                Rs. {product.price}
              </p>

              <button
                onClick={() => handleAddToCart(product)}
                className="mt-4 w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800"
              >
                🛒 Add to Cart
              </button>

              <button
                onClick={() => handleRemove(product)}
                className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                ❌ Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;