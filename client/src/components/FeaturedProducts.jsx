import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import products from "../data/products";

function FeaturedProducts() {
  const { addToCart } = useContext(CartContext);

  return (
    <section className="max-w-7xl mx-auto py-16 px-6">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-10">
        Featured Products
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-lg p-5 text-center hover:shadow-xl transition"
          >
            <div className="text-6xl">{product.image}</div>

            <h3 className="text-xl font-bold mt-4">
              {product.name}
            </h3>

            <p className="text-green-700 font-semibold">
              Rs. {product.price}
            </p>

            <button
              onClick={() => addToCart(product)}
              className="mt-4 bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;