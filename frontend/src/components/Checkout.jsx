import { useEffect, useState } from "react";
import { formatINR } from "./Utils/INR";
import { useNavigate, useLocation } from "react-router-dom";
import { startPayment } from "./Utils/Payment";
import { getAccessToken } from "./Utils/getAccessToken";

export default function Checkout() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);

  /* 🏠 DELIVERY STATES */
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [coords, setCoords] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState({
    lat: 20.5937, // India default
    lng: 78.9629,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [codloading, setcodLoading] = useState(false); // ✅ page loading state


  const GST_PERCENT = 5;

  /* ---------------- PROTECT ROUTE ---------------- */
  useEffect(() => {
    if (!location.state?.fromCart) {
      navigate("/cart", { replace: true });
    }
  }, []);

  /* ---------------- FETCH CART ---------------- */
  useEffect(() => {
    async function fetchCart() {
      const token = getAccessToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/cart/get-cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (result.success) setCart(result.data);
      setLoading(false);
    }
    fetchCart();
  }, []);

  /* ---------------- FETCH USER ---------------- */
  useEffect(() => {
    async function fetchUser() {
      const token = getAccessToken();
      if (!token) return;

      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (res.ok) setUser(result.user);
    }
    fetchUser();
  }, []);

  /* ---------------- DELIVERY HELPERS ---------------- */

  const reverseGeocode = async (lat, lon) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    const data = await res.json();
    return data.display_name || "";
  };

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setDetecting(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ latitude, longitude });

        const address = await reverseGeocode(latitude, longitude);
        setDeliveryAddress(address);
        setDetecting(false);
      },
      () => {
        alert("Permission denied");
        setDetecting(false);
      }
    );
  };

  const useSavedAddress = () => {
    if (!user?.address) {
      alert("No saved address found");
      return;
    }
    setDeliveryAddress(user.address);
  };

  const openMapPicker = async () => {
    // If we already have coords (from detect location), use them
    if (coords) {
      setMapCenter({
        lat: coords.latitude,
        lng: coords.longitude,
      });
    }

    setShowMap(true);
  };

  const confirmMapLocation = async () => {
    const address = await reverseGeocode(mapCenter.lat, mapCenter.lng);
    setDeliveryAddress(address);
    setShowMap(false);
  };

  const finalAddress = deliveryAddress;

  /* ---------------- BILL ---------------- */
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gstAmount = (subtotal * GST_PERCENT) / 100;
  const amount = subtotal + gstAmount;

  /* ---------------- PAYMENT ---------------- */
  const handlePayment = (method) => {
    if (!finalAddress) {
      alert("Please select delivery address");
      return;
    }

    setShowModal(false);

    if (method === "online") {
      startPayment(navigate, setLoading, finalAddress);
    }
    else if (method === "cod") {
      handleCod()
    }
  };

  async function handleCod() {
    try {
      setcodLoading(true)
      const token = getAccessToken();
      if (!token) return;


      const Res = await fetch(`${API_URL}/payments/cod`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deliveryAddress: finalAddress,
        }),
      });

      const data = await Res.json();

      if (!data.success) {
        alert("Failed to create order");
        setcodLoading(false);
        return;
      }

      const { orderId, bill } = data;
      const amount = bill.grandTotal;

      window.dispatchEvent(new Event("cartUpdated"));
      setcodLoading(false)

      navigate("/payment-success", {
        state: { orderNumber: orderId, amount: amount.toFixed(2), mode: "cod", fromSuccess: true, },
        replace: true
      });
    } catch (err) {
      console.error(err);
      alert("Verification error");
    } finally {
      setcodLoading(false);
    }
  }

  // ✅ Full-page spinner while initial page is loading
  if ((loading && cart.length === 0) || codloading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-5xl bg-base-100 shadow-2xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl text-primary">
            Checkout
          </h2>

          <div className="divider"></div>

          {/* ORDER TABLE */}
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="text-right">Price</th>
                  <th className="text-center">Qty</th>
                  <th className="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td className="text-right">{formatINR(item.price)}</td>
                    <td className="text-center">{item.qty}</td>
                    <td className="text-right">
                      {formatINR(item.price * item.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTAL */}
          <div className="text-right mt-4 space-y-3">
            <p>Subtotal: {formatINR(subtotal)}</p>
            <p>GST (5%): {formatINR(gstAmount)}</p>
            <p className="text-xl font-bold text-primary">
              Total: {formatINR(amount)}
            </p>
          </div>

          {/* DELIVERY LOCATION */}
          <div className="mt-6 p-4 border rounded-xl">
            <h3 className="font-semibold mb-3">📦 Delivery Location</h3>

            <div className="flex gap-2 mb-3 flex-wrap">
              <button
                className="btn btn-xs btn-outline"
                onClick={useSavedAddress}
              >
                Saved Address
              </button>

              <button
                className="btn btn-xs btn-outline"
                onClick={detectCurrentLocation}
              >
                {detecting ? "Detecting..." : "Current Location"}
              </button>

              <button
                className="btn btn-xs btn-outline"
                onClick={openMapPicker}
              >
                Google Map
              </button>
            </div>

            <textarea
              className="textarea textarea-bordered w-full text-sm"
              rows="3"
              placeholder="Enter delivery address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />
          </div>

          {/* ACTIONS */}
          <div className="card-actions justify-center mt-6 gap-4">
            <button
              className="btn btn-primary w-40"
              onClick={() => setShowModal(true)}
            >
              Confirm Order
            </button>

            <button
              className="btn btn-outline btn-error w-40"
              onClick={() => navigate("/cart", { replace: true })}
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-xl w-80">
            <h3 className="font-bold mb-4 text-center">Payment Method</h3>

            <button
              className="btn btn-primary w-full mb-3"
              onClick={() => handlePayment("online")}
            >
              Online Payment
            </button>

            <button
              className="btn btn-outline btn-error w-full mb-3"
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
      )}
      {showMap && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-base-100 rounded-xl p-4 w-[90%] max-w-xl">
            <h3 className="font-semibold mb-2">Pick Location</h3>

            {/* MAP */}
            <iframe
              title="map-picker"
              width="100%"
              height="300"
              className="rounded-lg border"
              src={`https://www.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}&z=16&output=embed`}
            />

            <p className="text-xs text-gray-500 mt-2 text-center">
              Move the map and confirm center location
            </p>

            <div className="flex gap-2 mt-4">
              <button
                className="btn btn-primary w-full"
                onClick={confirmMapLocation}
              >
                Use This Location
              </button>

              <button
                className="btn btn-outline w-full"
                onClick={() => setShowMap(false)}
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
