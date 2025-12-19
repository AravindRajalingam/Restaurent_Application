import { useState, useEffect } from "react";
import Navbar from "./Navbar";

export default function MenuPage() {
  const categories = ["Starters", "Main Course", "Desserts", "Beverages"];

  const menuItems = [
    { id: 1, name: "Chicken Wings", category: "Starters", price: 5.99, img: "/images/chicken_wings.jpg" },
    { id: 2, name: "Paneer Tikka", category: "Starters", price: 4.99, img: "/images/paneer_tikka.jpg" },
    { id: 3, name: "Grilled Salmon", category: "Main Course", price: 12.99, img: "/images/salmon.jpg" },
    { id: 4, name: "Veg Biryani", category: "Main Course", price: 9.99, img: "/images/biryani.jpg" },
    { id: 5, name: "Chocolate Lava Cake", category: "Desserts", price: 6.99, img: "/images/lava_cake.jpg" },
    { id: 6, name: "Ice Cream Sundae", category: "Desserts", price: 4.99, img: "/images/ice_cream.jpg" },
    { id: 7, name: "Coke", category: "Beverages", price: 1.99, img: "/images/coke.jpg" },
    { id: 8, name: "Fresh Juice", category: "Beverages", price: 2.99, img: "/images/juice.jpg" },
  ];

  const [selectedCategory, setSelectedCategory] = useState("Starters");
  // const [cart, setCart] = useState([]);

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
    setCart(
      (prev) => { return prev.map((i) => i.id === id ? { ...i, qty: i.qty + 1 } : i) }
    )
  }

  const decreaseCount = (id) => {
    setCart(prev =>
      prev
        .map(i =>
          i.id === id ? { ...i, qty: i.qty - 1 } : i
        )
        .filter(i => i.qty > 0) // auto remove
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
              className={`btn btn-sm rounded-full font-semibold transition-all duration-300 ${selectedCategory === cat ? "btn-warning text-white" : "btn-outline btn-secondary"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Menu Items */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {menuItems
              .filter((item) => item.category === selectedCategory)
              .map((item) => {

                const cartItem = cart.find(c => c.id === item.id);

                return (
                  <div key={item.id} className="card bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-2xl overflow-hidden border border-gray-200">
                    <figure className="h-48 overflow-hidden">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </figure>

                    <div className="card-body text-center">
                      <h2 className="card-title justify-center text-lg font-bold text-gray-800">
                        {item.name}
                      </h2>

                      <p className="text-gray-600 font-semibold">
                        ${item.price.toFixed(2)}
                      </p>

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
                            ADD
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

          </div>

          {/* Cart */}
          {/* <div className="sticky top-28 bg-white p-6 rounded-2xl shadow-xl h-fit border border-gray-200">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Your Order</h3>
            {cart.length === 0 ? (
              <p className="text-gray-500">No items added.</p>
            ) : (
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li key={item.id} className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <div>
                      <p className="font-semibold text-gray-800">{item.name} x {item.qty}</p>
                      <p className="text-gray-500">${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decreaseCount(item.id)}
                        className="btn btn-xs btn-outline btn-error"
                      >
                        −
                      </button>

                      <span className="font-semibold">{item.qty}</span>

                      <button
                        onClick={() => increaseCount(item.id)}
                        className="btn btn-xs btn-outline btn-primary"
                      >
                        +
                      </button>
                    </div>

                  </li>
                ))}
              </ul>
            )}
            <div className="divider my-4"></div>
            <p className="text-lg font-bold flex justify-between text-gray-800">
              Total: <span>${total.toFixed(2)}</span>
            </p>
            {cart.length > 0 && (
              <button className="btn btn-primary btn-block mt-4 hover:bg-blue-600">
                Checkout
              </button>
            )}
          </div> */}

        </div>
      </div>
    </div>
  );
}
