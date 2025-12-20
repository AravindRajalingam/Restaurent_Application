import { useState, useEffect } from "react";
import { formatINR } from "./Utils/INR";
import sampleimg from '../assets/sample.avif'

export default function MenuPage() {

  const API_URL = import.meta.env.VITE_API_URL;

  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/menu/get-categories`);

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }
        const result = await res.json();
        setCategories(result.data); // 👈 because backend sends { success, data }

      } catch (err) {
        alert(err)
      }
    };

    fetchCategories();
  }, []);


  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch(`${API_URL}/menu/get-menu-items`);

        if (!res.ok) {
          throw new Error("Failed to fetch menu items");
        }
        const result = await res.json();
        setMenuItems(result.data); // 👈 because backend sends { success, data }

      } catch (err) {
        alert(err)
      }
    };

    fetchMenuItems();
  }, []);


  // const menuItems = [
  //   { id: 1, name: "Chicken Wings", category: "Starters", price: 5.99, img: sampleimg },
  //   { id: 2, name: "Paneer Tikka", category: "Starters", price: 4.99, img: sampleimg },
  //   { id: 3, name: "Grilled Salmon", category: "Main Course", price: 12.99, img: sampleimg },
  //   { id: 4, name: "Veg Biryani", category: "Main Course", price: 9.99, img: sampleimg },
  //   { id: 5, name: "Chocolate Lava Cake", category: "Desserts", price: 6.99, img: sampleimg },
  //   { id: 6, name: "Ice Cream Sundae", category: "Desserts", price: 4.99, img: sampleimg },
  //   { id: 7, name: "Coke", category: "Beverages", price: 1.99, img: sampleimg },
  //   { id: 8, name: "Fresh Juice", category: "Beverages", price: 2.99, img: sampleimg },
  //   { id: 9, name: "Paneer Tikka", category: "Starters", price: 4.99, img: sampleimg },
  // ];

  const [menuItems, setMenuItems] = useState([])

  const [selectedCategory, setSelectedCategory] = useState("Lunch");

  // const [cart, setCart] = useState(() => {
  //   const savedCart = localStorage.getItem("cart");
  //   return savedCart ? JSON.parse(savedCart) : [];
  // });

  // const addToCart = (item) => {
  //   setCart((prev) => {
  //     const exist = prev.find((i) => i.id === item.id);
  //     if (exist) {
  //       return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
  //     } else {
  //       return [...prev, { ...item, qty: 1 }];
  //     }
  //   });
  // };

  // const removeFromCart = (id) => {
  //   setCart((prev) => prev.filter((item) => item.id !== id));
  // };



  const [cart, setCart] = useState([]);

  useEffect(() => {
    async function fetchCart() {
      const token = localStorage.getItem("access_token");

      const res = await fetch(`${API_URL}/cart/get-cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (result.success) {
        setCart(result.data);
      }
    }

    fetchCart();
  }, []);



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

    // refresh cart
    const res = await fetch(`${API_URL}/cart/get-cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    setCart(result.data);
  };



  const removeFromCart = async (id) => {
    const token = localStorage.getItem("access_token");

    await fetch(`${API_URL}/cart/remove-from-cart/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setCart((prev) => prev.filter((item) => item.id !== id));
  };


  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

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
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </figure>

                  {/* BODY */}
                  <div className="h-[40%] flex flex-col justify-between p-4 text-center">

                    {/* Name + Description + Price */}
                    <div className="space-y-1">
                      <h2 className="text-lg font-bold text-gray-800">
                        {item.name}
                      </h2>

                      <p className="text-sm text-gray-500 italic line-clamp-2">
                        {item.description}
                      </p>

                      <p className="text-lg font-semibold text-primary mt-1">
                        {formatINR(item.price.toFixed(2))}
                      </p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-center mt-3">
                      {cartItem ? (
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="btn btn-outline btn-error btn-sm w-full"
                        >
                          Remove From Cart
                        </button>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="btn btn-warning btn-sm w-full"
                        >
                          ADD TO CART
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );

            })}
        </div>
      </div>
    </div>
  );
}
