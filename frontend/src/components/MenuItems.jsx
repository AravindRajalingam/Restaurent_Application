import { useState, useEffect } from "react";
import { formatINR } from "./Utils/INR";
import sampleimg from '../assets/sample.avif';
import { useNavigate } from "react-router-dom";
import Toast from "./Utils/Toast";
import { getAccessToken } from "./Utils/getAccessToken";
export default function MenuPage() {

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Lunch");
  const [cart, setCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(null); // for add/remove
  const [loadingData, setLoadingData] = useState(true); // for initial fetch

  const [toast, setToast] = useState({
    show: false,
    nature: "info",
    content: "",
  });


  /* ---------------- FETCH CATEGORIES & MENU ITEMS ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [catRes, menuRes] = await Promise.all([
          fetch(`${API_URL}/menu/get-categories`),
          fetch(`${API_URL}/menu/get-menu-items`)
        ]);

        if (!catRes.ok || !menuRes.ok) throw new Error("Failed to fetch data");

        const cartResult = await catRes.json();
        const menuResult = await menuRes.json();

        setCategories(cartResult.data);
        setMenuItems(menuResult.data);
      } catch (err) {
        alert(err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  /* ---------------- FETCH CART ---------------- */
  useEffect(() => {
    async function fetchCart() {
      const token = getAccessToken();
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/cart/get-cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (result.success) setCart(result.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchCart();
  }, []);

  /* ---------------- ADD TO CART ---------------- */
  const addToCart = async (item) => {
  

    const token = getAccessToken();
    if (!token) {
      setToast({
        show: true,
        nature: "info",
        content: "Please Login to Continue"
      })
      return
    }

    setLoadingCart(item.id);
    try {
      await fetch(`${API_URL}/cart/add-to-cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ item_id: item.id, price: item.price }),
      });

      // refresh cart
      const res = await fetch(`${API_URL}/cart/get-cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      setCart(result.data);
      window.dispatchEvent(new Event("cartUpdated"));
    } finally {
      setLoadingCart(null);
    }
  };

  /* ---------------- REMOVE FROM CART ---------------- */
  const removeFromCart = async (id) => {
    const token = getAccessToken();
    if (!token) return;

    setLoadingCart(id);
    try {
      await fetch(`${API_URL}/cart/remove-from-cart/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart((prev) => prev.filter((item) => item.id !== id));
      window.dispatchEvent(new Event("cartUpdated"));
    } finally {
      setLoadingCart(null);
    }
  };

  /* ---------------- TOTAL ---------------- */
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  /* ---------------- RENDER ---------------- */
  if (loadingData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Category Tabs */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`btn rounded-2xl font-bold transition-all duration-300 ${selectedCategory === cat.name ? "btn-warning text-white" : "btn-outline btn-secondary"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems
            .filter(item => item.category === selectedCategory)
            .map(item => {
              const cartItem = cart.find(c => c.id === item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-md 
                             hover:shadow-xl hover:-translate-y-1 transition-all duration-300 
                             h-[400px] flex flex-col overflow-hidden"
                >
                  {/* IMAGE */}
                  <figure className="h-[60%] overflow-hidden">
                    <img
                      src={item.image_url || sampleimg}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </figure>

                  {/* BODY */}
                  <div className="h-[40%] flex flex-col justify-between p-4 text-center">

                    {/* Name + Description + Price */}
                    <div className="space-y-1">
                      <h2 className="text-lg font-bold text-gray-800">{item.name}</h2>
                      <p className="text-sm text-gray-500 italic line-clamp-2">{item.description}</p>
                      <p className="text-lg font-semibold text-primary mt-1">{formatINR(item.price.toFixed(2))}</p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-center mt-3">
                      {cartItem ? (
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="btn btn-outline btn-error btn-sm w-full flex items-center justify-center"
                          disabled={loadingCart === item.id}
                        >
                          {loadingCart === item.id ? <span className="loading loading-spinner loading-sm"></span> : "REMOVE FROM CART"}
                        </button>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="btn btn-warning btn-sm w-full flex items-center justify-center"
                          disabled={loadingCart === item.id}
                        >
                          {loadingCart === item.id ? <span className="loading loading-spinner loading-sm"></span> : "ADD TO CART"}
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
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
