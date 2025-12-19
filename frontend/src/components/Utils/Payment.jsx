// import React from "react";

// const PaymentButton = () => {

//   const API_URL = import.meta.env.VITE_API_URL;

//   const handlePayment = async () => {
//     try {
//       const access_token = localStorage.getItem("access_token")
//       // 1. Create order on backend
//       const createOrderRes = await fetch(`${API_URL}/payments/create-order`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", "Authorization": `Bearer ${access_token}` },
//         body: JSON.stringify({ amount: 1 }), // INR,

//       });

//       const data = await createOrderRes.json();

//       if (!data.success) {
//         alert("Failed to create order");
//         return;
//       }

//       const options = {
//         key: "rzp_test_Rsaqu7zIlz6Um3", // frontend can use public key
//         amount: data.order.amount,
//         currency: data.order.currency,
//         name: "Restaurant App",
//         description: "Food Order Payment",
//         order_id: data.order.id,
//         prefill: {
//           name: "Aravind R",                // optional
//           email: "rajaaravind088@example.com",       // optional
//           contact: "9342055679"            // optional mobile number
//         },
//         handler: async function (response) {
//           const access_token = localStorage.getItem("access_token")

//           // 2. Verify payment on backend
//           const verifyRes = await fetch(`${API_URL}/payments/verify-payment`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json", "Authorization": `Bearer ${access_token}` },
//             body: JSON.stringify({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//             }),
//           })


//           const verifyData = await verifyRes.json();

//           if (verifyData.success) {
//             alert("Payment successful and verified!");
//           } else {
//             alert("Payment verification failed!");
//           }
//         },

//         theme: { color: "#F37254" },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       console.error(err);
//       alert("Payment failed. Try again.");
//     }
//   };

//   return <button onClick={handlePayment}>Pay Now</button>;
// };

// export default PaymentButton;


















export async function startPayment(amount) {
  const API_URL = import.meta.env.VITE_API_URL;

  try {
    const access_token = localStorage.getItem("access_token");

    // 1️⃣ Create order on backend
    const createOrderRes = await fetch(
      `${API_URL}/payments/create-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({ amount }), // INR
      }
    );

    const data = await createOrderRes.json();

    if (!data.success) {
      alert("Failed to create order");
      return;
    }

    // 2️⃣ Razorpay options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // public key only
      amount: data.order.amount,
      currency: data.order.currency,
      name: "Restaurant App",
      description: "Food Order Payment",
      order_id: data.order.id,

      prefill: {
        name: "Aravind R",
        email: "example@email.com",
        contact: "9342055679",
      },

      handler: async function (response) {
        try {
          const verifyRes = await fetch(
            `${API_URL}/payments/verify-payment`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            }
          );

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            alert("Payment successful!");
          } else {
            alert("Payment verification failed!");
          }
        } catch (err) {
          console.error(err);
          alert("Verification error");
        }
      },

      theme: { color: "#F37254" },
    };

    // 3️⃣ Open Razorpay
    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error(err);
    alert("Payment failed. Try again.");
  }
}

