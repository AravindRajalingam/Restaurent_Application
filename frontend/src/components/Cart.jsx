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
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
  <div className="card w-full max-w-4xl bg-base-100 shadow-2xl">

    <div className="card-body">
      {/* HEADER */}
      <h2 className="card-title justify-center text-2xl sm:text-3xl text-primary">
        Your Cart
      </h2>

      <div className="divider"></div>

      {/* EMPTY CART */}
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
          {/* CART ITEMS */}
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex flex-col sm:flex-row justify-between items-center bg-base-200 rounded-xl p-4 shadow-sm gap-4"
              >
                {/* ITEM INFO */}
                <div>
                  <p className="font-bold text-lg">{item.name}</p>
                  <p className="text-sm opacity-70">
                    {formatINR(item.price.toFixed(2))}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decreaseCount(item.id)}
                    className="btn btn-sm btn-outline btn-error"
                  >
                    −
                  </button>

                  <span className="badge badge-primary badge-lg">
                    {item.qty}
                  </span>

                  <button
                    onClick={() => increaseCount(item.id)}
                    className="btn btn-sm btn-outline btn-primary"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="btn btn-sm btn-outline btn-error"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="divider divider-primary my-6"></div>

          {/* TOTAL */}
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">
              {formatINR(total.toFixed(2))}
            </span>
          </div>

          {/* ACTION BUTTONS */}
          <div className="card-actions justify-center mt-8 gap-4">
            <button
              onClick={() => navigate("/checkout")}
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
