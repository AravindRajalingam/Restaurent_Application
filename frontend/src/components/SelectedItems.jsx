import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Toast from "./Utils/Toast";
import { getAccessToken } from "./Utils/getAccessToken";
export default function SelectedItems() {
  const { item_id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);


  const [toast, setToast] = useState({
    show: false,
    nature: "info",
    content: "",
  });

  /* ---------------- FETCH ITEM ---------------- */
  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await fetch(`${API_URL}/menu/item/${item_id}`);
        const data = await res.json();
        if (data.success) setItem(data.data);
      } catch (err) {
        console.error("Failed to fetch item:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [item_id]);

  /* ---------------- FETCH CART ---------------- */
  const fetchCart = async () => {
    const token = getAccessToken();
    if (!token) return;


    try {
      const res = await fetch(`${API_URL}/cart/get-cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setCart(data.data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /* ---------------- ADD TO CART ---------------- */
  const addToCart = async () => {
    if (!item) return;

    const token = getAccessToken();

    if (!token) {
      setToast({
        show: true,
        nature: "info",
        content: "Please Login to Continue"
      })
      return
    }
    setActionLoading(true);

    try {
      await fetch(`${API_URL}/cart/add-to-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          item_id: item.id,
          price: item.price,
        }),
      });

      await fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));

    } catch (err) {
      console.error("Add to cart failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  /* ---------------- REMOVE FROM CART ---------------- */
  const removeFromCart = async () => {
    if (!item) return;
    const token = getAccessToken();
    if (!token) return;

    setActionLoading(true);

    try {
      // Since your cart row id = item id
      await fetch(`${API_URL}/cart/remove-from-cart/${item.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart(prev => prev.filter(c => c.id !== item.id));
      window.dispatchEvent(new Event("cartUpdated"));

    } catch (err) {
      console.error("Remove from cart failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const Spinner = ({ size = "sm" }) => (
    <span className={`loading loading-spinner loading-${size}`}></span>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!item) return <div className="text-center py-20">Item not found</div>;

  // ✅ cartItem exists if item.id matches any cart row
  const cartItem = cart.find(c => c.id === item.id);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 btn btn-outline btn-sm"
        >
          ← Back
        </button>

        <div className="bg-white rounded-2xl border shadow-md overflow-hidden">
          <figure className="h-[350px] overflow-hidden">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </figure>

          <div className="p-6 text-center space-y-3">
            <span className="badge badge-warning badge-outline">
              {item.category}
            </span>

            <h1 className="text-2xl font-bold">{item.name}</h1>
            <p className="text-gray-500 italic">{item.description}</p>
            <p className="text-2xl font-semibold text-primary">
              ₹ {item.price.toFixed(2)}
            </p>

            <div className="pt-4">
              {cartItem ? (
                <button
                  onClick={removeFromCart}
                  className="btn btn-outline btn-error w-full"
                  disabled={actionLoading}
                >
                  {actionLoading ? <Spinner /> : "REMOVE FROM CART"}
                </button>
              ) : (
                <button
                  onClick={addToCart}
                  className="btn btn-warning w-full"
                  disabled={actionLoading}
                >
                  {actionLoading ? <Spinner /> : "ADD TO CART"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toast
        show={toast.show}
        nature={toast.nature}
        content={toast.content}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
