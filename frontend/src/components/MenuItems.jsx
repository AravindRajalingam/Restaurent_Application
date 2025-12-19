import { useState, useEffect } from "react";
import { formatINR } from "./Utils/INR";
import sampleimg from '../assets/sample.avif'

export default function MenuPage() {
  const categories = ["Starters", "Main Course", "Desserts", "Beverages"];

  const menuItems = [
    { id: 1, name: "Chicken Wings", category: "Starters", price: 5.99, img: sampleimg },
    { id: 2, name: "Paneer Tikka", category: "Starters", price: 4.99, img: sampleimg },
    { id: 3, name: "Grilled Salmon", category: "Main Course", price: 12.99, img: sampleimg },
    { id: 4, name: "Veg Biryani", category: "Main Course", price: 9.99, img: sampleimg },
    { id: 5, name: "Chocolate Lava Cake", category: "Desserts", price: 6.99, img: sampleimg },
    { id: 6, name: "Ice Cream Sundae", category: "Desserts", price: 4.99, img: sampleimg },
    { id: 7, name: "Coke", category: "Beverages", price: 1.99, img: sampleimg },
    { id: 8, name: "Fresh Juice", category: "Beverages", price: 2.99, img: sampleimg },
    { id: 9, name: "Paneer Tikka", category: "Starters", price: 4.99, img: sampleimg },
  ];

  const [selectedCategory, setSelectedCategory] = useState("Starters");

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const addToCart = (item) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.id === item.id);
      if (exist) {
        return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      } else {
        return [...prev, { ...item, qty: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const increaseCount = (id) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i));
  }

  const decreaseCount = (id) => {
    setCart(prev =>
      prev
        .map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i)
        .filter(i => i.qty > 0)
    );
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Category Tabs */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn rounded-2xl font-bold transition-all duration-300 ${selectedCategory === cat ? "btn-warning text-white" : "btn-outline btn-secondary"
                }`}
            >
              {cat}
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
                <div key={item.id} className="card bg-white shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 rounded-2xl overflow-hidden border border-gray-200 h-[400px] flex flex-col">

                  {/* IMAGE - 75% height */}
                  <figure className="h-[65%] overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </figure>

                  {/* BODY - remaining 25% */}
                  <div className="card-body text-center h-[25%] flex flex-col justify-between">
                    <div>
                      <h2 className="card-title justify-center text-lg font-bold text-gray-800">
                        {item.name}
                      </h2>

                      <p className="text-gray-600 font-semibold">
                        {formatINR(item.price.toFixed(2))}
                      </p>
                    </div>

                    <div className="card-actions justify-center mt-2">
                      {cartItem ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decreaseCount(item.id)}
                            className="btn btn-sm btn-outline btn-error"
                          >
                            −
                          </button>
                          <span className="font-semibold">{cartItem.qty}</span>
                          <button
                            onClick={() => increaseCount(item.id)}
                            className="btn btn-sm btn-outline btn-primary"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="btn btn-warning btn-sm w-32"
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
