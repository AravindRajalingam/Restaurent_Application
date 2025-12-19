import { useEffect, useState } from "react";
import { formatINR } from "./Utils/INR";
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${API_URL}/orders/my-orders`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (data.success) {
          setOrders(data.orders);
        } else {
          alert("Failed to fetch orders");
        }
      } catch (err) {
        console.error(err);
        alert("Server error");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <button className="btn btn-square loading text-primary">Loading</button>
      </div>
    );

  if (!orders.length)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">No orders found</h2>
        </div>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">My Orders</h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total Amount</th>
              <th>GST</th>
              <th>Grand Total</th>
              <th>Payment Status</th>
              <th>Order Status</th>
              <th>Placed On</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id.slice(0, 8)}...</td>
                <td>{formatINR(order.total_amount.toFixed(2))}</td>
                <td>{order.gst_amount ? formatINR(order.gst_amount.toFixed(2)) : "-"}</td>
                <td>{order.grand_total ? formatINR(order.grand_total.toFixed(2)) : "-"}</td>
                <td>
                  {order.payment_status === "Pending" ? (
                    <span className="badge badge-warning">Pending</span>
                  ) : (
                    <span className="badge badge-success">Paid</span>
                  )}
                </td>
                <td>
                  {order.order_status === "Placed" ? (
                    <span className="badge badge-info">Placed</span>
                  ) : (
                    <span className="badge badge-success">{order.order_status}</span>
                  )}
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
