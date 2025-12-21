import { useEffect, useState } from "react";
import { formatINR } from "./Utils/INR";
import { useNavigate, useLocation } from "react-router-dom";
import { startPayment } from "./Utils/Payment";
import { getAccessToken } from "./Utils/getAccessToken";

export default function Checkout() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ page loading state
  const [showModal, setShowModal] = useState(false); // For payment selection modal
  const navigate = useNavigate();
  const location = useLocation();

  const GST_PERCENT = 5;

  useEffect(() => {

    if (!location.state?.fromCart) {
      navigate("/cart", { replace: true });
    }
  }, []);


  useEffect(() => {
    async function fetchCart() {
      const token = getAccessToken();
      if (!token) return;


      try {
        const res = await fetch(`${API_URL}/cart/get-cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        if (result.success) {
          setCart(result.data);
        }
      } finally {
        setLoading(false); // stop loading after fetch
      }
    }

    fetchCart();
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gstAmount = (subtotal * GST_PERCENT) / 100;
  const amount = subtotal + gstAmount;

  const handlePayment = (method) => {
    setShowModal(false);

    if (method === "online") {
      setLoading(true);
      startPayment(navigate, setLoading);
    } else if (method === "cod") {
      handleCod();
    }
  };

  async function handleCod() {
    try {
      const token = getAccessToken();
      if (!token) return;


      const Res = await fetch(`${API_URL}/payments/cod`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await Res.json();

      if (!data.success) {
        alert("Failed to create order");
        setLoading(false);
        return;
      }

      const { orderId, bill } = data;
      const amount = bill.grandTotal;

      navigate("/payment-success", {
        state: { orderNumber: orderId, amount: amount.toFixed(2), mode: "cod" },
      });
    } catch (err) {
      console.error(err);
      alert("Verification error");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Full-page spinner while initial page is loading
  if (loading && cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-5xl bg-base-100 shadow-2xl">

        {/* HEADER */}
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl sm:text-3xl text-primary">
            Order Confirmation
          </h2>

          <div className="divider"></div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="text-right">Price</th>
                  <th className="text-center">Qty</th>
                  <th className="text-right">GST</th>
                  <th className="text-right">Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {cart.map((item) => {
                  const itemTotal = item.price * item.qty;
                  const itemGST = (itemTotal * GST_PERCENT) / 100;
                  return (
                    <tr key={item.id}>
                      <td className="font-semibold">{item.name}</td>
                      <td className="text-right">{formatINR(item.price.toFixed(2))}</td>
                      <td className="text-center">
                        <span className="badge badge-secondary">{item.qty}</span>
                      </td>
                      <td className="text-right">{formatINR(itemGST.toFixed(2))}</td>
                      <td className="text-right font-medium">{formatINR((itemTotal + itemGST).toFixed(2))}</td>
                    </tr>
                  );
                })}
              </tbody>

              {/* TOTALS */}
              <tfoot>
                <tr>
                  <td colSpan="4" className="text-right font-semibold">
                    Subtotal
                  </td>
                  <td className="text-right font-semibold">{formatINR(subtotal.toFixed(2))}</td>
                </tr>
                <tr>
                  <td colSpan="4" className="text-right font-semibold">
                    GST ({GST_PERCENT}%)
                  </td>
                  <td className="text-right font-semibold">{formatINR(gstAmount.toFixed(2))}</td>
                </tr>
                <tr>
                  <td colSpan="4" className="text-right text-lg font-bold text-primary">
                    Grand Total
                  </td>
                  <td className="text-right text-lg font-bold text-primary">
                    {formatINR(amount.toFixed(2))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* INFO ALERT */}
          <div className="alert alert-info mt-6">
            <span>Please review your order before confirming payment.</span>
          </div>

          {/* ACTION BUTTONS */}
          <div className="card-actions justify-center mt-8 gap-4">
            <button
              className="btn btn-primary w-40"
              disabled={loading}
              onClick={() => setShowModal(true)}
            >
              {loading && <span className="loading loading-spinner loading-sm mr-2"></span>}
              Confirm Order
            </button>

            <button
              className="btn btn-outline btn-error w-40"
              onClick={() => navigate("/cart")}
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-base-100 rounded-xl shadow-2xl w-80 p-6">
            <h3 className="text-lg font-bold text-center mb-4">Select Payment Method</h3>
            <div className="flex flex-col gap-4">
              <button
                className="btn btn-primary w-full"
                onClick={() => handlePayment("online")}
              >
                Online Payment
              </button>
              <button
                className="btn btn-outline btn-secondary w-full"
                onClick={() => handlePayment("cod")}
              >
                Cash on Delivery
              </button>
              <button
                className="btn btn-ghost w-full"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
