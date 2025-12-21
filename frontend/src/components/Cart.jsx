import { useState, useEffect } from "react";
import { formatINR } from "./Utils/INR";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "./Utils/IsLoggedIn";
import { getAccessToken } from "./Utils/getAccessToken";


export default function Cart() {

  const API_URL = import.meta.env.VITE_API_URL;

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [incloadingItemId, setIncloadingItemId] = useState(null);
  const [decloadingItemId, setDecloadingItemId] = useState(null);
  const [removeLoadingItemId, setRemoveLoadingItemId] = useState(null);

  useEffect(() => {
    async function fetchCart() {

      const token = getAccessToken();
      if (!token) {
        setLoading(false);
        return
      };

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
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  const increaseCount = async (cartId) => {
    const token = getAccessToken();
    if (!token) return;

    setIncloadingItemId(cartId);

    try {
      await fetch(`${API_URL}/cart/increase/${cartId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart(prev =>
        prev.map(item =>
          item.id === cartId ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } finally {
      setIncloadingItemId(null);
    }
  };

  const decreaseCount = async (cartId) => {
    const token = getAccessToken();
    if (!token) return;

    setDecloadingItemId(cartId);

    try {
      await fetch(`${API_URL}/cart/decrease/${cartId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart(prev =>
        prev
          .map(item =>
            item.id === cartId ? { ...item, qty: item.qty - 1 } : item
          )
          .filter(item => item.qty > 0)
      );

      window.dispatchEvent(new Event("cartUpdated"));
    } finally {
      setDecloadingItemId(null);
    }
  };

  const removeFromCart = async (id) => {
    const token = getAccessToken();
    if (!token) return;

    setRemoveLoadingItemId(id);

    try {
      await fetch(`${API_URL}/cart/remove-from-cart/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart(prev => prev.filter(item => item.id !== id));
      window.dispatchEvent(new Event("cartUpdated"));
    } finally {
      setRemoveLoadingItemId(null);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    );
  }

  /* ---------------- NOT LOGGED IN ---------------- */
  if (!isLoggedIn()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">
            Please login to view your cart
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

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card w-full max-w-4xl bg-base-100 shadow-2xl">

        <div className="card-body">
          <h2 className="card-title justify-center text-2xl sm:text-3xl text-primary">
            Your Cart
          </h2>

          <div className="divider"></div>

          {cart.length === 0 ? (
            <div className="flex flex-col items-center py-12 gap-4">
              <div className="alert alert-warning w-full max-w-md justify-center">
                <span>Your cart is empty</span>
              </div>

              <button
                onClick={() => navigate("/item-menu")}
                className="btn btn-primary w-48"
              >
                Buy Now
              </button>
            </div>
          ) : (
            <>
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col sm:flex-row justify-between items-center bg-base-200 rounded-xl p-4 shadow-sm gap-4"
                  >
                    <div>
                      <p className="font-bold text-lg">{item.name}</p>
                      <p className="text-sm opacity-70">
                        {formatINR(item.price.toFixed(2))}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => decreaseCount(item.id)}
                        className="btn btn-xs sm:btn-sm btn-outline btn-error"
                        disabled={decloadingItemId === item.id}
                      >
                        {decloadingItemId === item.id ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : "-"}
                      </button>

                      <span className="badge badge-primary badge-lg">
                        {item.qty}
                      </span>

                      <button
                        onClick={() => increaseCount(item.id)}
                        className="btn btn-xs sm:btn-sm btn-outline btn-primary"
                        disabled={incloadingItemId === item.id}
                      >
                        {incloadingItemId === item.id ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : "+"}
                      </button>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="btn btn-sm btn-outline btn-error"
                        disabled={removeLoadingItemId === item.id}
                      >
                        {removeLoadingItemId === item.id ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : "Remove"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="divider divider-primary my-6"></div>

              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">
                  {formatINR(total.toFixed(2))}
                </span>
              </div>

              <div className="card-actions justify-center mt-8 gap-4">
                <button
                  onClick={() => navigate("/checkout", { state: { fromCart: true },replace:true })}
                  className="btn btn-primary w-48"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate("/item-menu")}
                  className="btn btn-outline btn-primary w-48"
                >
                  Add More Items
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
