import { useNavigate } from "react-router-dom";

export default function PaymentSuccess({ orderNumber, amount }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl rounded-2xl p-6 text-center">
        {/* Success Icon */}
        <div className="mx-auto mb-6">
          <svg
            className="w-20 h-20 text-green-500 mx-auto"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-green-600 mb-2">
          Payment Successful!
        </h2>

        <p className="text-gray-600 mb-4">
          Your order <span className="font-semibold">#{orderNumber}</span> has been placed successfully.
        </p>

        <p className="text-gray-700 mb-6">
          Total Amount Paid: <span className="font-bold text-gray-900">{amount}</span>
        </p>

        <div className="flex flex-col gap-3">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/")}
          >
            Go to Home
          </button>
          <button
            className="btn btn-outline btn-secondary"
            onClick={() => navigate("/my-orders")}
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
}
