import { useEffect, useState } from "react";
import { formatINR } from "./Utils/INR";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "./Utils/IsLoggedIn";

export default function MyOrders() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrders() {
      if (!isLoggedIn()) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${API_URL}/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (data.success) {
          setOrders(data.orders || []);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  /* ---------------- NOT LOGGED IN ---------------- */
  if (!isLoggedIn()) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">
            Please login to view your orders
          </h2>
          <button
            onClick={() => navigate("/auth")}
            className="btn btn-primary"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- NO ORDERS ---------------- */
  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">No orders found</h2>
        </div>
      </div>
    );
  }

  /* ---------------- ORDERS TABLE ---------------- */
  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">My Orders</h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total</th>
              <th>GST</th>
              <th>Grand Total</th>
              <th>Mode</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Placed On</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id.slice(0, 8)}...</td>
                <td>{formatINR(order.total_amount.toFixed(2))}</td>
                <td>
                  {order.gst_amount
                    ? formatINR(order.gst_amount.toFixed(2))
                    : "-"}
                </td>
                <td>
                  {order.grand_total
                    ? formatINR(order.grand_total.toFixed(2))
                    : "-"}
                </td>
                <td>
                  <span className="badge badge-warning">
                    {order.mode === "cod" ? "Cash on Delivery" : "Online"}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      order.payment_status === "Paid"
                        ? "badge-success"
                        : order.payment_status === "Pending"
                        ? "badge-warning"
                        : order.payment_status === "Failed"
                        ? "badge-error"
                        : "badge-ghost"
                    }`}
                  >
                    {order.payment_status}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      order.order_status === "Placed"
                        ? "badge-info"
                        : "badge-success"
                    }`}
                  >
                    {order.order_status}
                  </span>
                </td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
