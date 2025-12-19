import React from "react";

const PaymentButton = () => {
  const handlePayment = async () => {
    try {
      const access_token = localStorage.getItem("access_token")
      // 1. Create order on backend
      const createOrderRes = await fetch("http://localhost:5000/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${access_token}` },
        body: JSON.stringify({ amount: 1 }), // INR,

      });

      const data = await createOrderRes.json();

      if (!data.success) {
        alert("Failed to create order");
        return;
      }

      const options = {
        key: "rzp_test_Rsaqu7zIlz6Um3", // frontend can use public key
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Restaurant App",
        description: "Food Order Payment",
        order_id: data.order.id,
        prefill: {
          name: "Aravind R",                // optional
          email: "rajaaravind088@example.com",       // optional
          contact: "9342055679"            // optional mobile number
        },
        handler: async function (response) {
          const access_token = localStorage.getItem("access_token")

          // 2. Verify payment on backend
          const verifyRes = await fetch("http://localhost:5000/api/payments/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${access_token}` },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })


          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            alert("Payment successful and verified!");
          } else {
            alert("Payment verification failed!");
          }
        },

        theme: { color: "#F37254" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Try again.");
    }
  };

  return <button onClick={handlePayment}>Pay Now</button>;
};

export default PaymentButton;
