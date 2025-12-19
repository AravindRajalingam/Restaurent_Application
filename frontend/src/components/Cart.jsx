import { useState, useEffect } from "react";
import { formatINR } from "./Utils/INR";
import { useNavigate } from "react-router-dom";

export default function Cart() {

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const increaseCount = (id) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    ));
  };

  const decreaseCount = (id) => {
    setCart(
      cart
        .map(item =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter(item => item.qty > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="bg-gray-100 min-h-screen">

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">

          <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
            Your Order
          </h3>

          {cart.length === 0 ? (
            <div className="flex flex-col justify-center items-center">
              <p className="text-gray-500 text-center py-10">
                Your cart is empty
              </p>
              <button onClick={() => navigate("/item-menu")} className="btn btn-outline btn-primary w-1/2 mt-5">
                Order Now
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.map(item => (
                <li
                  key={item.id}
                  className="flex justify-between items-center border-b border-gray-200 pb-3"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatINR(item.price.toFixed(2))}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="btn btn-sm btn-outline btn-error"
                    >
                      Remove From Cart
                    </button>
                    <button
                      onClick={() => decreaseCount(item.id)}
                      className="btn btn-xs sm:btn-sm btn-outline btn-error"
                    >
                      −
                    </button>

                    <span className="font-semibold w-6 text-center">
                      {item.qty}
                    </span>

                    <button
                      onClick={() => increaseCount(item.id)}
                      className="btn btn-xs sm:btn-sm btn-outline btn-primary"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="divider divider-primary my-4"></div>

          <div className="flex justify-center gap-5 text-lg font-bold text-gray-800">
            <span>Total : </span>
            <span>{formatINR(total.toFixed(2))}</span>
          </div>

          {cart.length > 0 && (
            <div className="flex flex-col items-center">
              <button onClick={() => {
                navigate("/checkout")
              }}
                className="btn btn-outline btn-primary w-1/2 mt-6">
                Proceed to Checkout
              </button>
              <button onClick={() => navigate("/item-menu")} className="btn btn-outline btn-primary w-1/2 mt-5">
                Add More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
