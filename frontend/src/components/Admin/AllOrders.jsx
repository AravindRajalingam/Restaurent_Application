import { useEffect, useState } from "react";

export default function AllOrders() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAllOrders() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/orders/fetch-all-orders`);
        if (!res.ok) throw new Error("Failed to fetch orders");

        const result = await res.json();

        if (result.success) {
          setOrders(result.data);
          setTotalOrders(result.count);
        } else {
          throw new Error(result.message || "Something went wrong");
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAllOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            All Orders
          </h1>
          <span className="badge badge-primary badge-lg">
            Total Orders: {totalOrders}
          </span>
        </div>

        {/* ORDERS LIST */}
        <div className="space-y-6">
          {orders.map((o, index) => (
            <div
              key={index}
              className="card bg-base-100 shadow-md border"
            >
              <div className="card-body space-y-4">

                {/* ORDER HEADER */}
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <p className="font-semibold">
                      Order ID: <span className="text-sm text-gray-500">{o.order.orderId}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(o.order.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <span className="badge badge-outline">
                      {o.order.paymentMode.toUpperCase()}
                    </span>
                    <span className="badge badge-info">
                      {o.order.paymentStatus}
                    </span>
                    <span className="badge badge-success">
                      {o.order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* USER INFO */}
                <div className="text-sm">
                  <p className="font-semibold">Customer</p>
                  <p>{o.user?.name} • {o.user?.phone}</p>
                  <p className="text-gray-500">
                    {o.order.deliveryAddress || "No address provided"}
                  </p>
                </div>

                {/* ITEMS */}
                <div>
                  <p className="font-semibold mb-2">Items</p>

                  <div className="space-y-2">
                    {o.items.length === 0 && (
                      <p className="text-sm text-gray-500 italic">
                        No items (payment failed)
                      </p>
                    )}

                    {o.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-base-200 p-2 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              {item.category} • ₹{item.price} × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold">
                          ₹{item.itemTotal}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TOTALS */}
                <div className="text-right space-y-1">
                  <p className="text-sm">
                    Subtotal: ₹{o.order.totals.subtotal}
                  </p>
                  <p className="text-sm">
                    GST: ₹{o.order.totals.gst.toFixed(2)}
                  </p>
                  <p className="text-lg font-bold text-primary">
                    Grand Total: ₹{o.order.totals.grandTotal}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
