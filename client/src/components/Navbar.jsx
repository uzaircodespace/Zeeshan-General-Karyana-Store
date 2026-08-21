import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

function Navbar() {
  const navigate = useNavigate();

  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">

        <Link
          to="/"
          className="text-2xl font-bold hover:text-yellow-300"
        >
          🛒 Zeeshan General & Karyana Store
        </Link>

        <ul className="flex gap-5 items-center">

          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/products">Products</Link>
          </li>

          <li>
            <Link to="/wishlist">
              ❤️ Wishlist ({wishlist.length})
            </Link>
          </li>

          <li>
            <Link to="/cart">
              🛒 Cart ({totalItems})
            </Link>
          </li>

          {token && (
            <li>
              <Link to="/my-orders">
                📦 My Orders
              </Link>
            </li>
          )}

          {user?.role === "admin" && (
            <li>
              <Link
                to="/admin"
               className="hover:text-yellow-300"
              >
                Admin Dashboard
              </Link>
            </li>
          )}

          {!token ? (
            <>
              <li>
                <Link to="/login">
                  Login
                </Link>
              </li>

              <li>
                <Link to="/register">
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="font-semibold">
                👋 {user?.name}
              </li>

              <li>
                <button
                  onClick={logout}
                  className="bg-red-500 px-3 py-2 rounded-lg hover:bg-red-600"
                >
                  Logout
                </button>
              </li>
            </>
          )}

        </ul>
      </div>
    </nav>
  );
}

export default Navbar;