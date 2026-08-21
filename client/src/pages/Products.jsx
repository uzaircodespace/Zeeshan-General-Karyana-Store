
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import API from "../api/api";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

function Products() {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // ===============================
  // Fetch Products
  // ===============================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/products");

        console.log("PRODUCT API RESPONSE:", response.data);

        const productList = Array.isArray(response.data?.products)
          ? response.data.products
          : [];

        setProducts(productList);
      } catch (error) {
        console.error("FAILED TO LOAD PRODUCTS:", error);
        console.error("STATUS:", error.response?.status);
        console.error("SERVER RESPONSE:", error.response?.data);

        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  // ===============================
  // Categories
  // ===============================
  const categories = [
    "All",
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];

  // ===============================
  // Filter Products
  // ===============================
  const filteredProducts = products.filter((product) => {
    const productName = product.name || "";
    const productCategory = product.category || "";

    const matchesSearch = productName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || productCategory === category;

    return matchesSearch && matchesCategory;
  });

  // ===============================
  // Add To Cart
  // ===============================
  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart 🛒`);
  };

  // ===============================
  // Add To Wishlist
  // ===============================
  const handleAddToWishlist = (product) => {
    addToWishlist(product);
    toast.info(`${product.name} added to wishlist ❤️`);
  };

  // ===============================
  // Image URL
  // ===============================
  const getImageUrl = (image) => {
    if (!image) {
      return null;
    }

    // Cloudinary / external image
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Convert Windows "\" to "/"
    const cleanImage = image
      .replace(/\\/g, "/")
      .replace(/^\/+/, "");

    return `http://localhost:5000/${cleanImage}`;
  };

  return (
    <section className="min-h-screen bg-gray-50 py-10 px-4">
      {/* ===============================
          Heading
      =============================== */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-green-700 mb-8">
          Our Products
        </h1>

        {/* ===============================
            Search
        =============================== */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* ===============================
            Categories
        =============================== */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                category === cat
                  ? "bg-green-700 text-white"
                  : "bg-gray-200 hover:bg-green-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ===============================
            Products
        =============================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const imageUrl = getImageUrl(product.image);

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-lg p-5 text-center hover:shadow-xl transition"
                >
                  {/* Product Image */}
                  <div className="flex justify-center items-center h-40 mb-4">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-32 h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="text-6xl">
                        🛒
                      </div>
                    )}
                  </div>

                  {/* Product Name */}
                  <h2 className="text-xl font-bold mt-2">
                    {product.name}
                  </h2>

                  {/* Category */}
                  <p className="text-gray-500 mt-1">
                    {product.category}
                  </p>

                  {/* Stock */}
                  <p
                    className={`font-semibold mt-2 ${
                      Number(product.stock) > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Stock: {product.stock}
                  </p>

                  {/* Price */}
                  <p className="text-green-700 font-semibold mt-2">
                    Rs. {product.price}
                  </p>

                  {/* Buttons */}
                  <div className="mt-4 flex flex-col gap-2">
                    {Number(product.stock) > 0 ? (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-green-700 text-white py-2 rounded-lg hover:bg-green-800"
                      >
                        🛒 Add to Cart
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed"
                      >
                        Out of Stock
                      </button>
                    )}

                    <button
                      onClick={() => handleAddToWishlist(product)}
                      className="bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600"
                    >
                      ❤️ Add to Wishlist
                    </button>

                    <Link
                      to={`/product/${product._id}`}
                      className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                      👁 View Details
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-xl text-gray-500 py-10">
              No products found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Products;

