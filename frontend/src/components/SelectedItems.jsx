import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function SelectedItems() {
  const { item_id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  /* ---------------- FETCH SINGLE ITEM ---------------- */
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(
          `${API_URL}/menu/item/${item_id}`
        );
        const data = await res.json();

        if (data.success) {
          setItem(data.data);
        }
      } catch (err) {
        console.error("Item fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [item_id]);

  /* ---------------- FETCH CART ---------------- */
//   useEffect(() => {
//     const fetchCart = async () => {
//       const token = localStorage.getItem("access_token");
//       if (!token) return;

//       const res = await fetch(`${API_URL}/cart/get-cart`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const result = await res.json();
//       setCart(result.data || []);
//     };

//     fetchCart();
//   }, []);

  /* ---------------- ADD TO CART ---------------- */
  const addToCart = async (item) => {
    const token = localStorage.getItem("access_token");

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

    const res = await fetch(`${API_URL}/cart/get-cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    setCart(result.data || []);
  };

  /* ---------------- REMOVE FROM CART ---------------- */
  const removeFromCart = async (itemId) => {
    const token = localStorage.getItem("access_token");

    await fetch(`${API_URL}/cart/remove-from-cart/${itemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setCart((prev) =>
      prev.filter((c) => c.item_id !== itemId)
    );
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!item) {
    return <div className="text-center py-20">Item not found</div>;
  }

  const cartItem = cart.find(
    (c) => c.item_id === item.id
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 btn btn-outline btn-sm"
        >
          ← Back
        </button>

        {/* ITEM CARD */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md
        hover:shadow-xl transition-all duration-300 overflow-hidden">

          {/* IMAGE */}
          <figure className="h-[350px] overflow-hidden">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </figure>

          {/* CONTENT */}
          <div className="p-6 text-center space-y-3">
            <span className="badge badge-warning badge-outline">
              {item.category}
            </span>

            <h1 className="text-2xl font-bold text-gray-800">
              {item.name}
            </h1>

            <p className="text-gray-500 italic">
              {item.description}
            </p>

            <p className="text-2xl font-semibold text-primary">
              ₹ {item.price.toFixed(2)}
            </p>

            {/* CART ACTION */}
            <div className="pt-4">
              {cartItem ? (
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="btn btn-outline btn-error w-full"
                >
                  Remove From Cart
                </button>
              ) : (
                <button
                  onClick={() => addToCart(item)}
                  className="btn btn-warning w-full"
                >
                  ADD TO CART
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
