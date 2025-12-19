import { useState } from "react";
import { formatINR } from "./Utils/INR";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [cart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const navigate = useNavigate();

  const GST_PERCENT = 5;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const gstAmount = (subtotal * GST_PERCENT) / 100;
  const grandTotal = subtotal + gstAmount;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">

          <h3 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 text-center">
            Order Confirmation
          </h3>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-100">
                <tr className="text-gray-700">
                  <th>Item</th>
                  <th className="text-right">Price</th>
                  <th className="text-center">Qty</th>
                  <th className="text-right">GST</th>
                  <th className="text-right">Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {cart.map(item => {
                  const itemTotal = item.price * item.qty;
                  const itemGST = (itemTotal * GST_PERCENT) / 100;

                  return (
                    <tr key={item.id}>
                      <td className="font-semibold">{item.name}</td>
                      <td className="text-right">
                        {formatINR(item.price.toFixed(2))}
                      </td>
                      <td className="text-center">{item.qty}</td>
                      <td className="text-right">
                        {formatINR(itemGST.toFixed(2))}
                      </td>
                      <td className="text-right font-medium">
                        {formatINR((itemTotal + itemGST).toFixed(2))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* FOOTER TOTALS */}
              <tfoot>
                <tr>
                  <td colSpan="4" className="text-right font-semibold">
                    Subtotal
                  </td>
                  <td className="text-right font-semibold">
                    {formatINR(subtotal.toFixed(2))}
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" className="text-right font-semibold">
                    GST ({GST_PERCENT}%)
                  </td>
                  <td className="text-right font-semibold">
                    {formatINR(gstAmount.toFixed(2))}
                  </td>
                </tr>
                <tr className="bg-gray-100">
                  <td colSpan="4" className="text-right text-lg font-bold">
                    Grand Total
                  </td>
                  <td className="text-right text-lg font-bold">
                    {formatINR(grandTotal.toFixed(2))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col items-center mt-8 gap-4">
            <button
              className="btn btn-primary w-1/2"
              onClick={() => alert("Order placed!")}
            >
              Confirm Order
            </button>

            <button
              className="btn btn-outline btn-error w-1/2"
              onClick={() => navigate("/cart")}
            >
              Back to Cart
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
