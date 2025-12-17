import Razorpay from 'razorpay'
import crypto from 'crypto'
import { supabase } from '../Config/supabaseClient.js'
import dotenv from "dotenv"
dotenv.config()

export const calculateBill = (req, res) => {
  const { subtotal } = req.body
  const gstRate = 0.05

  const gst = subtotal * gstRate
  const grandTotal = subtotal + gst

  res.json({ subtotal, gst, grandTotal })
}


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

/**
 * CREATE RAZORPAY ORDER
 */
export const createPaymentOrder = async (req, res) => {
  const { amount, userId } = req.body; // userId from your frontend to store in DB

  try {
    if (!amount || amount < 1) {
      return res.status(400).json({ success: false, message: "Amount must be >= 1 INR" });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    });

    // Insert order in Supabase
    // const { data: dbOrder, error } = await supabase
    //   .from("orders")
    //   .insert([
    //     {
    //       id: order.id,             // use Razorpay order id as PK
    //       user_id: userId,
    //       total_amount: amount,
    //       payment_status: "Pending"
    //     }
    //   ])
    //   .select()
    //   .single();

    // if (error) {
    //   console.error("Supabase insert error:", error);
    //   return res.status(500).json({ success: false, message: "Failed to create order in DB" });
    // }

    res.json({ success: true, order });
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    res.status(500).json({ success: false, message: "Payment order creation failed", error: err.message });
  }
};

/**
 * VERIFY PAYMENT SIGNATURE
 */
export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    // 1. Validate signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // 2. Update order payment status in Supabase
    const { data, error } = await supabase
      .from("orders")
      .update({
        payment_status: "Paid",
        payment_id: razorpay_payment_id
      })
      .eq("id", razorpay_order_id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return res.status(500).json({ success: false, message: "Failed to update order in DB" });
    }

    res.json({ success: true, message: "Payment verified successfully", order: data });
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ success: false, message: "Payment verification failed", error: err.message });
  }
};
