
import { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Admin() {
  // Products
  const [products, setProducts] = useState([]);

  // Orders
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Image
  const [image, setImage] = useState(null);



  // =======================
// Coupons
// =======================
const [coupons, setCoupons] = useState([]);

const [couponForm, setCouponForm] = useState({
  code: "",
  discountType: "percentage",
  discountValue: "",
  minimumOrderAmount: "",
  expiryDate: "",
  usageLimit: 1,
});

  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  // Dashboard Stats
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    topProducts: [],
    monthlySales: [],
  });

  const monthNames = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const salesData =
    stats.monthlySales?.map((item) => ({
      month: monthNames[item._id],
      sales: item.sales,
    })) || [];

  // Search
  const [search, setSearch] = useState("");

  // Category Filter
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Product Form
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    rating: "",
    description: "",
    image: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
  fetchProducts();
  fetchOrders();
  fetchCustomers();
  fetchDashboardStats();
  fetchCoupons();
}, []);

  // =======================
  // Invoice
  // =======================
  const downloadInvoice = async (orderId) => {
    try {
      const response = await API.get(`/invoice/${orderId}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${orderId}.pdf`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Invoice Downloaded Successfully");
    } catch (error) {
      console.error(error);

      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Invoice Download Failed");
      }
    }
  };

  // =======================
  // PDF Report
  // =======================
  const downloadPDFReport = async () => {
    try {
      const response = await API.get("/reports/pdf", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.download = "Sales-Report.pdf";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.success("PDF Report Downloaded");
    } catch (error) {
      console.error(error);
      toast.error("PDF Download Failed");
    }
  };

  // =======================
  // Excel Report
  // =======================
  const downloadExcelReport = async () => {
    try {
      const response = await API.get("/reports/excel", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.download = "Sales-Report.xlsx";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      toast.success("Excel Report Downloaded");
    } catch (error) {
      console.error(error);
      toast.error("Excel Download Failed");
    }
  };

  const fetchProducts = async () => {
  try {
    const response = await API.get("/products");

    console.log("PRODUCT API RESPONSE:", response.data);

    setProducts(
      Array.isArray(response.data.products)
        ? response.data.products
        : []
    );
  } catch (error) {
    console.error("FAILED TO LOAD PRODUCTS");
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", error.response?.data);
    console.error("MESSAGE:", error.message);

    setProducts([]);
  }
};

  // =======================
  // Fetch Customers
  // =======================
  const fetchCustomers = async () => {
    try {
      const { data } = await API.get("/customers");
      setCustomers(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to Load Customers");
    }
  };

  // =======================
  // Fetch Orders
  // =======================
  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders");

console.log("ORDERS API RESPONSE:", data);

setOrders(
  Array.isArray(data)
    ? data
    : Array.isArray(data.orders)
    ? data.orders
    : []
);
    } catch (error) {
      console.error(error);
      toast.error("Failed to Load Orders");
    }
  };

  // =======================
  // Dashboard Statistics
  // =======================
  const fetchDashboardStats = async () => {
    try {
      const { data } = await API.get("/dashboard");
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };
  // =======================
// Fetch Coupons
// =======================
const fetchCoupons = async () => {
  try {
    const { data } = await API.get("/coupons");

    console.log("COUPONS:", data);

    setCoupons(
      Array.isArray(data.coupons)
        ? data.coupons
        : []
    );
  } catch (error) {
    console.error("FAILED TO LOAD COUPONS");
    console.error("STATUS:", error.response?.status);
    console.error("DATA:", error.response?.data);
    console.error("MESSAGE:", error.message);

    toast.error("Failed to Load Coupons");
  }
};
// =======================
// Create Coupon
// =======================
const createCoupon = async () => {
  try {
    if (
      !couponForm.code ||
      !couponForm.discountValue ||
      !couponForm.expiryDate
    ) {
      toast.error("Please fill all required coupon fields");
      return;
    }

    const { data } = await API.post("/coupons", {
      code: couponForm.code,
      discountType: couponForm.discountType,
      discountValue: Number(couponForm.discountValue),
      minimumOrderAmount: Number(
        couponForm.minimumOrderAmount || 0
      ),
      expiryDate: couponForm.expiryDate,
      usageLimit: Number(
        couponForm.usageLimit || 1
      ),
    });

    toast.success(
      data.message || "Coupon Created Successfully"
    );

    // Add new coupon to list
    setCoupons((prev) => [
      data.coupon,
      ...prev,
    ]);

    // Reset form
    setCouponForm({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minimumOrderAmount: "",
      expiryDate: "",
      usageLimit: 1,
    });

  } catch (error) {
    console.error(
      "CREATE COUPON ERROR:",
      error
    );

    console.error(
      "STATUS:",
      error.response?.status
    );

    console.error(
      "DATA:",
      error.response?.data
    );

    toast.error(
      error.response?.data?.message ||
      "Failed to Create Coupon"
    );
  }
};

// =======================
// Delete Coupon
// =======================
const deleteCoupon = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this coupon?"
  );

  if (!confirmDelete) return;

  try {
    const { data } = await API.delete(`/coupons/${id}`);

    toast.success(data.message);

    setCoupons((prev) =>
      prev.filter((coupon) => coupon._id !== id)
    );
  } catch (error) {
    console.error("DELETE COUPON ERROR:", error);

    toast.error(
      error.response?.data?.message ||
        "Failed to Delete Coupon"
    );
  }
};
// =======================
// Toggle Coupon Status
// =======================
const toggleCouponStatus = async (coupon) => {
  try {
    const { data } = await API.put(
      `/coupons/${coupon._id}`,
      {
        isActive: !coupon.isActive,
      }
    );

    toast.success(data.message);

    setCoupons((prev) =>
      prev.map((item) =>
        item._id === coupon._id
          ? data.coupon
          : item
      )
    );
  } catch (error) {
    console.error(
      "TOGGLE COUPON ERROR:",
      error
    );

    toast.error(
      error.response?.data?.message ||
        "Failed to Update Coupon"
    );
  }
};

  // =======================
  // Update Order Status
  // =======================
  const updateOrderStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, { status });

      toast.success("Order Updated");

      fetchOrders();
      fetchDashboardStats();
    } catch (error) {
      toast.error("Failed to Update");
    }
  };
  const verifyPayment = async (order) => {
  try {
    if (!order?._id || !order?.transactionId) {
      toast.error("Order ID or Transaction ID is missing.");
      return;
    }

    console.log("🔍 Verifying Payment...");
    console.log("Order ID:", order._id);
    console.log("Transaction ID:", order.transactionId);

    const { data } = await API.post(
      "/payments/verify",
      {
        orderId: order._id,
        transactionId: order.transactionId,
      }
    );

    console.log("✅ Verification Response:", data);

    if (data.paymentStatus === "Paid") {
      toast.success("Payment is verified and Paid.");
    } else {
      toast.info(
        "Payment is still Pending. Gateway confirmation required."
      );
    }

    // Orders dobara load karo
    await fetchOrders();

  } catch (error) {
    console.error("❌ Payment Verification Error:", error);

    toast.error(
      error.response?.data?.message ||
        "Payment verification failed"
    );
  }
};

  // =======================
  // Handle Input Change
  // =======================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =======================
  // Edit Product
  // =======================
  const handleEdit = (item) => {
    setEditingId(item._id);
    setImage(null);

    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      stock: item.stock,
      rating: item.rating,
      description: item.description,
      image: item.image,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =======================
  // Add / Update Product
  // =======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("stock", formData.stock);
      data.append("rating", formData.rating);

      if (image) {
        data.append("image", image);
      }

      if (editingId) {
        await API.put(`/products/${editingId}`, data);

        toast.success("✅ Product Updated");
      } else {
        await API.post("/products", data);

        toast.success("✅ Product Added");
      }

      // Reset
      setEditingId(null);
      setImage(null);

      setFormData({
        name: "",
        category: "",
        price: "",
        stock: "",
        rating: "",
        description: "",
        image: "",
      });

      fetchProducts();
      fetchDashboardStats();
    } catch (error) {
      console.error("========== PRODUCT OPERATION ERROR ==========");

      if (error.response) {
        console.error("STATUS:", error.response.status);
        console.error("SERVER RESPONSE:", error.response.data);
        console.error("HEADERS:", error.response.headers);
      } else if (error.request) {
        console.error("REQUEST ERROR:", error.request);
      } else {
        console.error("ERROR:", error.message);
      }

      console.error("FULL ERROR:", error);

      toast.error(
        error.response?.data?.message || "Operation Failed"
      );
    }
  };

  // =======================
  // View Customer
  // =======================
  const viewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(true);
  };

  const viewCustomerOrders = (customer) => {
    const ordersList = orders.filter(
      (order) => order.user?._id === customer._id
    );

    setCustomerOrders(ordersList);
    setShowOrdersModal(true);
  };

  // =======================
  // Delete Customer
  // =======================
  const deleteCustomer = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/customers/${id}`);

      toast.success("Customer Deleted Successfully");

      fetchCustomers();
      fetchDashboardStats();
    } catch (error) {
      console.error(error);
      toast.error("Failed to Delete Customer");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <div className="bg-green-600 text-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold">📦 Total Products</h3>
          <p className="text-3xl font-bold mt-2">
            {stats.totalProducts}
          </p>
        </div>

        <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold">🛒 Total Orders</h3>
          <p className="text-3xl font-bold mt-2">
            {stats.totalOrders}
          </p>
        </div>

        <div className="bg-purple-600 text-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold">👥 Total Users</h3>
          <p className="text-3xl font-bold mt-2">
            {stats.totalUsers}
          </p>
        </div>

        <div className="bg-orange-600 text-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold">💰 Revenue</h3>
          <p className="text-3xl font-bold mt-2">
            Rs. {stats.totalRevenue}
          </p>
        </div>

      </div>

      {/* Export Reports */}
      <div className="flex gap-4 mb-10">

        <button
          onClick={downloadPDFReport}
          className="bg-red-600 text-white px-5 py-3 rounded-lg hover:bg-red-700"
        >
          📄 Export PDF
        </button>

        <button
          onClick={downloadExcelReport}
          className="bg-green-700 text-white px-5 py-3 rounded-lg hover:bg-green-800"
        >
          📊 Export Excel
        </button>

      </div>

      {/* Dashboard Analytics */}
      <div className="bg-white shadow-lg rounded-xl p-8 mb-10">

        <h2 className="text-2xl font-bold mb-6">
          📈 Monthly Sales Report
        </h2>

        <div className="w-full h-80">

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              <Bar
                dataKey="sales"
                fill="#16a34a"
                radius={[8, 8, 0, 0]}
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* Top Selling Products */}
      <div className="bg-white shadow-lg rounded-xl p-8 mb-10">

        <h2 className="text-2xl font-bold mb-6">
          🏆 Top Selling Products
        </h2>

        <table className="w-full border">

          <thead>
            <tr className="bg-green-700 text-white">
              <th className="p-3">Product</th>
              <th className="p-3">Price</th>
              <th className="p-3">Sold</th>
            </tr>
          </thead>

          <tbody>

            {stats.topProducts?.map((item) => (
              <tr
                key={item._id}
                className="border-b text-center"
              >

                <td className="p-3">
                  {item.product.name}
                </td>

                <td className="p-3">
                  Rs. {item.product.price}
                </td>

                <td className="p-3 font-bold text-green-700">
                  {item.totalSold}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
      <p className="text-blue-600 font-bold">
  Low Stock Count: {products.filter((p) => p.stock <= 5).length}
</p>
    
{/* LOW STOCK PRODUCTS */}
<div className="bg-white rounded-xl shadow-lg p-6 mt-6">

  <h2 className="text-2xl font-bold mb-4">
    ⚠️ Low Stock Products
  </h2>

  {Array.isArray(products) &&
  products.filter((p) => Number(p.stock) <= 5).length > 0 ? (

    <table className="w-full border">

      <thead>
        <tr className="bg-red-600 text-white">
          <th className="p-3">Product</th>
          <th className="p-3">Category</th>
          <th className="p-3">Stock</th>
        </tr>
      </thead>

      <tbody>
        {products
          .filter((p) => Number(p.stock) <= 5)
          .map((item) => (
            <tr
              key={item._id}
              className="border-b text-center"
            >

              <td className="p-3">
                {item.name}
              </td>

              <td className="p-3">
                {item.category}
              </td>

              <td className="p-3 text-red-600 font-bold">
                {item.stock}
              </td>

            </tr>
          ))}
      </tbody>

    </table>

  ) : (

    <p className="text-green-600 font-semibold">
      ✅ No low stock products.
    </p>

  )}

</div>
      {/* Top Selling Products */}
      <div className="bg-white shadow-lg rounded-xl p-8 mb-10">

        <h2 className="text-2xl font-bold mb-6">
          🏆 Top Selling Products
        </h2>

        {stats.topProducts.length === 0 ? (

          <p>No Sales Yet.</p>

        ) : (

          <table className="w-full border">

            <thead>
              <tr className="bg-green-700 text-white">
                <th className="p-3">Rank</th>
                <th className="p-3">Product</th>
                <th className="p-3">Sold</th>
              </tr>
            </thead>

            <tbody>

              {stats.topProducts.map((item, index) => (
                <tr
                  key={item._id}
                  className="border-b text-center"
                >

                  <td className="p-3">
                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : index + 1}
                  </td>

                  <td className="p-3">
                    {item.product.name}
                  </td>

                  <td className="p-3 font-bold">
                    {item.totalSold}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        )}

      </div>

      {/* Add / Edit Product Form */}
      <div className="bg-white shadow-lg rounded-xl p-8 mb-10">

        <h2 className="text-2xl font-bold mb-6">
          {editingId ? "✏ Edit Product" : "➕ Add Product"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >

          {/* Product Name */}
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />

          {/* Category */}
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />

          {/* Price */}
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />

          {/* Stock */}
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            className="border p-3 rounded-lg"
            required
          />

          {/* Rating */}
          <input
            type="number"
            name="rating"
            placeholder="Rating"
            value={formData.rating}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          />

          {/* Image Upload */}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="border p-3 rounded-lg"
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border p-3 rounded-lg md:col-span-2"
          />

          <button
            type="submit"
            className="bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 md:col-span-2"
          >
            {editingId ? "Update Product" : "Add Product"}
          </button>

        </form>

      </div>

      {/* Products */}
      <div className="bg-white shadow-lg rounded-xl p-8">

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Search Product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-3 rounded-lg w-full md:w-1/2"
          />

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border p-3 rounded-lg"
          >
            <option value="All">All Categories</option>

            {[...new Set(products.map((p) => p.category))].map(
              (cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              )
            )}

          </select>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full border border-gray-300">

            <thead>
              <tr className="bg-green-700 text-white">

                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>

              </tr>
            </thead>

            <tbody>

              {(Array.isArray(products) ? products : [])
  .filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  )
  .filter(
    (item) =>
      categoryFilter === "All" ||
      item.category === categoryFilter
  )
  .map((item) => (
    <tr
      key={item._id}
      className="border-b text-center"
    >
                  

                    {/* Image */}
                    <td className="p-3">

                      {item.image?.startsWith("/uploads") ? (

                        <img
                         src={`https://management-trained-rabbit.abasthan.app${item.image}`}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg mx-auto"
                        />

                      ) : (

                        <span className="text-3xl">
                          {item.image}
                        </span>

                      )}

                    </td>

                    <td className="p-3">
                      {item.name}
                    </td>

                    <td className="p-3">
                      {item.category}
                    </td>

                    <td className="p-3">
                      Rs. {item.price}
                    </td>

                    <td className="p-3">
                      {item.stock}
                    </td>

                    <td className="p-3">
                      ⭐ {item.rating}
                    </td>

                    {/* Stock Status */}
                    <td className="p-3">

                      {item.stock === 0 ? (

                        <span className="bg-red-600 text-white px-3 py-1 rounded-full">
                          Out of Stock
                        </span>

                      ) : item.stock <= 5 ? (

                        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full">
                          Low Stock
                        </span>

                      ) : (

                        <span className="bg-green-600 text-white px-3 py-1 rounded-full">
                          In Stock
                        </span>

                      )}

                    </td>

                    {/* Actions */}
                    <td className="p-3">

                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
                        >
                          ✏ Edit
                        </button>

                        <button
                          onClick={async () => {

                            if (
                              !window.confirm(
                                "Delete this product?"
                              )
                            )
                              return;

                            try {

                              await API.delete(
                                `/products/${item._id}`
                              );

                              toast.success(
                                "Product Deleted"
                              );

                              fetchProducts();
                              fetchDashboardStats();

                            } catch (error) {

                              toast.error(
                                "Delete Failed"
                              );

                            }

                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
                        >
                          🗑 Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

            </tbody>

          </table>

        </div>

      </div>
      

{/* ======================= */}
{/* Coupon Management */}
{/* ======================= */}

<div className="bg-white shadow-lg rounded-xl p-8 mt-10">

  <h2 className="text-2xl font-bold mb-6">
    🎟️ Coupon Management
  </h2>

  {/* Create Coupon Form */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    <input
      type="text"
      placeholder="Coupon Code e.g. SAVE20"
      value={couponForm.code}
      onChange={(e) =>
        setCouponForm({
          ...couponForm,
          code: e.target.value.toUpperCase(),
        })
      }
      className="border p-3 rounded-lg"
    />

    <select
      value={couponForm.discountType}
      onChange={(e) =>
        setCouponForm({
          ...couponForm,
          discountType: e.target.value,
        })
      }
      className="border p-3 rounded-lg"
    >
      <option value="percentage">
        Percentage Discount
      </option>

      <option value="fixed">
        Fixed Discount
      </option>
    </select>

    <input
      type="number"
      placeholder="Discount Value"
      value={couponForm.discountValue}
      onChange={(e) =>
        setCouponForm({
          ...couponForm,
          discountValue: e.target.value,
        })
      }
      className="border p-3 rounded-lg"
    />

    <input
      type="number"
      placeholder="Minimum Order Amount"
      value={couponForm.minimumOrderAmount}
      onChange={(e) =>
        setCouponForm({
          ...couponForm,
          minimumOrderAmount: e.target.value,
        })
      }
      className="border p-3 rounded-lg"
    />

    <input
      type="date"
      value={couponForm.expiryDate}
      onChange={(e) =>
        setCouponForm({
          ...couponForm,
          expiryDate: e.target.value,
        })
      }
      className="border p-3 rounded-lg"
    />

    <input
      type="number"
      min="1"
      placeholder="Usage Limit"
      value={couponForm.usageLimit}
      onChange={(e) =>
        setCouponForm({
          ...couponForm,
          usageLimit: e.target.value,
        })
      }
      className="border p-3 rounded-lg"
    />

  </div>

  <button
    type="button"
    onClick={createCoupon}
    className="mt-5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
  >
    ➕ Create Coupon
  </button>


  {/* Coupon List */}
  <div className="overflow-x-auto mt-8">

    <table className="w-full border border-gray-300">

      <thead>
        <tr className="bg-blue-700 text-white">

          <th className="p-3">Code</th>
          <th className="p-3">Discount</th>
          <th className="p-3">Minimum Order</th>
          <th className="p-3">Expiry</th>
          <th className="p-3">Usage</th>
          <th className="p-3">Status</th>
          <th className="p-3">Actions</th>

        </tr>
      </thead>

      <tbody>

        {coupons.length === 0 ? (

          <tr>
            <td
              colSpan="7"
              className="p-5 text-center text-gray-500"
            >
              No Coupons Available
            </td>
          </tr>

        ) : (

          coupons.map((coupon) => (

            <tr
              key={coupon._id}
              className="border-b text-center"
            >

              {/* Code */}
              <td className="p-3 font-bold">
                {coupon.code}
              </td>

              {/* Discount */}
              <td className="p-3">

                {coupon.discountType === "percentage"
                  ? `${coupon.discountValue}%`
                  : `Rs. ${coupon.discountValue}`}

              </td>

              {/* Minimum Order */}
              <td className="p-3">
                Rs. {coupon.minimumOrderAmount}
              </td>

              {/* Expiry */}
              <td className="p-3">
                {new Date(
                  coupon.expiryDate
                ).toLocaleDateString()}
              </td>

              {/* Usage */}
              <td className="p-3">
                {coupon.usedCount} / {coupon.usageLimit}
              </td>

              {/* Status */}
              <td className="p-3">

                {coupon.isActive ? (
                  <span className="text-green-600 font-bold">
                    ✅ Active
                  </span>
                ) : (
                  <span className="text-red-600 font-bold">
                    ❌ Inactive
                  </span>
                )}

              </td>

              {/* Actions */}
              <td className="p-3">

                <div className="flex justify-center gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      toggleCouponStatus(coupon)
                    }
                    className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                  >
                    {coupon.isActive
                      ? "Deactivate"
                      : "Activate"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteCoupon(coupon._id)
                    }
                    className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                  >
                    🗑 Delete
                  </button>

                </div>

              </td>

            </tr>

          ))

        )}

      </tbody>

    </table>

  </div>

</div>


{/* ======================= */}
{/* Customer Orders */}
{/* ======================= */}

<div className="bg-white shadow-lg rounded-xl p-8 mt-10">

  <h2 className="text-2xl font-bold mb-6">
    📦 Customer Orders
  </h2>

  <div className="overflow-x-auto">

    <table className="w-full border border-gray-300">

      <thead>

        <tr className="bg-blue-700 text-white">

          <th className="p-3">Customer</th>
          <th className="p-3">Products</th>
          <th className="p-3">Total</th>
          <th className="p-3">Payment Method</th>
          <th className="p-3">Payment Status</th>
        
          <th className="p-3">Phone</th>
          <th className="p-3">Address</th>
          <th className="p-3">Status</th>
          <th className="p-3">Invoice</th>

        </tr>

      </thead>

      <tbody>

        {orders.map((order) => (

          <tr
            key={order._id}
            className="border-b text-center"
          >

            {/* Customer */}
            <td className="p-3">

              <div className="font-bold">
                {order.user?.name || "Unknown"}
              </div>

              <div className="text-sm text-gray-500">
                {order.user?.email || "No Email"}
              </div>

            </td>


            {/* Products */}
            <td className="p-3">

              {order.products?.map((item) => (

                <div key={item._id}>

                  {item.product?.name || "Product"} ×{" "}
                  {item.quantity}

                </div>

              ))}

            </td>


            {/* Total */}
            <td className="p-3 font-semibold">
              Rs. {order.totalPrice}
            </td>


           {/* Payment Method */}
<td className="p-3">
  <span className="text-gray-700 font-semibold">
    💵 Cash on Delivery
  </span>
</td>

{/* Payment Status */}
<td className="p-3">
  {order.paymentStatus === "Pending" ? (
    <button
      type="button"
      onClick={() => updatePaymentStatus(order._id, "Paid")}
      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg"
    >
      💰 Mark Paid
    </button>
  ) : (
    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
      ✅ Paid
    </span>
  )}
</td>


            {/* Phone */}
            <td className="p-3">
              {order.phone}
            </td>


            {/* Address */}
            <td className="p-3">
              {order.address}
            </td>


            {/* Order Status */}
            <td className="p-3">

              <select
                value={order.status}
                onChange={(e) =>
                  updateOrderStatus(
                    order._id,
                    e.target.value
                  )
                }
                className="border rounded-lg p-2"
              >

                <option value="Pending">
                  🕒 Pending
                </option>

                <option value="Processing">
                  ⚙️ Processing
                </option>

                <option value="Shipped">
                  🚚 Shipped
                </option>

                <option value="Out for Delivery">
                  📍 Out for Delivery
                </option>

                <option value="Delivered">
                  ✅ Delivered
                </option>

                <option value="Cancelled">
                  ❌ Cancelled
                </option>

              </select>

            </td>


            {/* Invoice */}
            <td className="p-3">

              <button
                type="button"
                onClick={() =>
                  downloadInvoice(order._id)
                }
                className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700"
              >
                📄 Download
              </button>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

</div>


{/* ======================= */}
{/* Customers */}
{/* ======================= */}

<div className="bg-white shadow-lg rounded-xl p-8 mt-10">

  <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">

    <h2 className="text-2xl font-bold">
      👥 Customers
    </h2>

    <input
      type="text"
      placeholder="🔍 Search Customer..."
      value={customerSearch}
      onChange={(e) =>
        setCustomerSearch(e.target.value)
      }
      className="border p-3 rounded-lg w-full md:w-72"
    />

  </div>


  <div className="overflow-x-auto">

    <table className="w-full border border-gray-300">

      <thead>

        <tr className="bg-purple-700 text-white">

          <th className="p-3">Name</th>
          <th className="p-3">Email</th>
          <th className="p-3">Orders</th>
          <th className="p-3">Total Spent</th>
          <th className="p-3">Joined</th>
          <th className="p-3">Actions</th>

        </tr>

      </thead>


      <tbody>

        {customers
          .filter((customer) =>
            (customer.name || "")
              .toLowerCase()
              .includes(
                customerSearch.toLowerCase()
              ) ||
            (customer.email || "")
              .toLowerCase()
              .includes(
                customerSearch.toLowerCase()
              )
          )
          .map((customer) => (

            <tr
              key={customer._id}
              className="border-b text-center"
            >

              <td className="p-3">
                {customer.name}
              </td>

              <td className="p-3">
                {customer.email}
              </td>

              <td className="p-3">
                {customer.totalOrders}
              </td>

              <td className="p-3">
                Rs. {customer.totalSpent}
              </td>

              <td className="p-3">
                {new Date(
                  customer.createdAt
                ).toLocaleDateString()}
              </td>

              <td className="p-3">

                <div className="flex justify-center gap-2">

                  <button
                    type="button"
                    onClick={() =>
                      viewCustomer(customer)
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
                  >
                    👤 View
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      viewCustomerOrders(customer)
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg"
                  >
                    📦 Orders
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteCustomer(customer._id)
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
                  >
                    🗑 Delete
                  </button>

                </div>

              </td>

            </tr>

          ))}

      </tbody>

    </table>

  </div>

</div>


{/* ======================= */}
{/* Customer Modal */}
{/* ======================= */}

{showCustomerModal && selectedCustomer && (

  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">

      <h2 className="text-2xl font-bold mb-6">
        👤 Customer Details
      </h2>

      <div className="space-y-3">

        <p>
          <strong>Name:</strong>{" "}
          {selectedCustomer.name}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {selectedCustomer.email}
        </p>

        <p>
          <strong>Total Orders:</strong>{" "}
          {selectedCustomer.totalOrders}
        </p>

        <p>
          <strong>Total Spent:</strong>{" "}
          Rs. {selectedCustomer.totalSpent}
        </p>

        <p>
          <strong>Joined:</strong>{" "}
          {new Date(
            selectedCustomer.createdAt
          ).toLocaleDateString()}
        </p>

      </div>

      <div className="mt-6 flex justify-end">

        <button
          type="button"
          onClick={() =>
            setShowCustomerModal(false)
          }
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
        >
          Close
        </button>

      </div>

    </div>

  </div>

)}

{/* Customer Orders Modal */}
{showOrdersModal && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-y-auto p-6">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          📦 Customer Orders
        </h2>

        <button
          type="button"
          onClick={() => setShowOrdersModal(false)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          ✖ Close
        </button>
      </div>

      {customerOrders.length === 0 ? (
        <p className="text-center text-gray-600">
          No Orders Found
        </p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="p-3">Order ID</th>
              <th className="p-3">Products</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {customerOrders.map((order) => (
              <tr
                key={order._id}
                className="border-b text-center"
              >
                <td className="p-3">
                  {order._id.slice(-6)}
                </td>

                <td className="p-3">
                  {order.products?.map((item) => (
                    <div key={item._id}>
                      {item.product?.name || "Product"} × {item.quantity}
                    </div>
                  ))}
                </td>

                <td className="p-3">
                  Rs. {order.totalPrice}
                </td>

                <td className="p-3">
                  {order.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  </div>
)}

</div>
);
}

export default Admin;