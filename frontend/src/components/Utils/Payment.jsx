export async function startPayment(cart, navigate, setLoading) {
  const API_URL = import.meta.env.VITE_API_URL;
  setLoading(true); // 🔹 move here

  try {
    const access_token = localStorage.getItem("access_token");

    // 1️⃣ Create order on backend
    const createOrderRes = await fetch(`${API_URL}/payments/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({ cartItems: cart }),
    });

    const data = await createOrderRes.json();

    if (!data.success) {
      alert("Failed to create order");
      setLoading(false); // 🔹 reset on failure
      return;
    }

    const { razorpayOrder, orderId, bill } = data;
    const amount = bill.grandTotal;

    // 2️⃣ Razorpay options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "Restaurant App",
      description: "Food Order Payment",
      order_id: razorpayOrder.id,
      handler: async function (response) {
        try {
          const verifyRes = await fetch(`${API_URL}/payments/verify-payment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              receipt: orderId,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            localStorage.removeItem("cart");

            navigate("/payment-success", {
              state: { orderNumber: orderId, amount: amount.toFixed(2) },
            });
          } else {
            alert("Payment verification failed!");
          }
        } catch (err) {
          console.error(err);
          alert("Verification error");
        } finally {
          setLoading(false); // ✅ stop loading after success or verification fail
        }
      },

      modal: {
        ondismiss: function () {
          console.log("Payment cancelled"); // debug
          setLoading(false); // ✅ stop loading if user cancels
        },
      },

      theme: { color: "#11046fff" },
    };

    // 3️⃣ Open Razorpay
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error(err);
    alert("Payment failed. Try again.");
    setLoading(false); // 🔹 reset on error
  }
}
