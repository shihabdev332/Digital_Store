import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../config";
import { FaCheckCircle, FaTruck, FaBoxOpen, FaClock, FaTimesCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // fetch orders
  const fetchOrders = async () => {
    if (!user || !token) return;

    try {
      setLoading(true);
      const res = await axios.get(`${serverUrl}/api/order/user/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setOrders(res.data.orders);
    } catch (err) {
      toast.error("Failed to fetch orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Client cancel
const handleClientCancel = async (orderId) => {
  try {
    const response = await axios.put(
      `${serverUrl}/api/order/cancel`,
      { orderId },
      { headers: { token } }
    );
    if (response.data.success) {
      toast.success("Order cancelled!");
      fetchOrders(); // refresh orders
    }
  } catch (err) {
    console.log("Cancel Error:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Cancel failed");
  }
};


  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return "text-green-600";
      case "Shipped": return "text-blue-600";
      case "Pending": return "text-yellow-600";
      case "Cancelled": return "text-red-600";
      default: return "text-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered": return <FaCheckCircle className="text-green-600" />;
      case "Shipped": return <FaTruck className="text-blue-600" />;
      case "Pending": return <FaClock className="text-yellow-600" />;
      case "Cancelled": return <FaTimesCircle className="text-red-600" />;
      default: return <FaBoxOpen className="text-gray-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">🛒 My Orders</h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-2xl p-4 shadow-md bg-white hover:shadow-lg transition duration-300"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="flex items-center gap-3">
                  {getStatusIcon(order.status)}
                  <p className={`font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </p>
                </div>
                <p className="text-sm text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-3 text-gray-700 space-y-1">
                <p><b>Total:</b> ${order.totalAmount}</p>
                <p><b>Payment:</b> {order.paymentMethod}</p>
                <p><b>Address:</b> {order.address}</p>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold text-gray-800">Products:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {order.products.map((p, index) => (
                    <li key={index}>
                      Product ID: {p.productId}, Qty: {p.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cancel button */}
              {order.status === "Pending" && (
                <div className="mt-3">
                  <button
                    onClick={() => handleClientCancel(order._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 transition duration-300"
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;
