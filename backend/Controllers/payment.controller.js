import Razorpay from "razorpay";
import crypto from "crypto";
import { supabase } from "../Config/supabaseClient.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * CALCULATE BILL (API)
 * Frontend can call this if needed
 */
export const calculateBill = (req, res) => {
  const { subtotal } = req.body;
  const gstRate = 0.05;

  const gst = subtotal * gstRate;
  const grandTotal = subtotal + gst;

  res.json({ subtotal, gst, grandTotal });
};

/**
 * INTERNAL BILL CALCULATION (REUSABLE)
 */
const calculateBillInternal = (subtotal) => {
  const gstRate = 0.05;
  const gst = subtotal * gstRate;
  const grandTotal = subtotal + gst;

  return { subtotal, gst, grandTotal };
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * CREATE ORDER + RAZORPAY ORDER
 * payment_status → Pending
 */
export const createPaymentOrder = async (req, res) => {
  const { amount } = req.body; // frontend sends subtotal

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  try {
    // 1️⃣ Calculate bill internally
    const { subtotal, gst, grandTotal } = calculateBillInternal(amount);

    // 2️⃣ Insert order into Supabase
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: req.user.id,
        total_amount: subtotal,
        gst_amount: gst,
        grand_total: grandTotal,
        payment_status: "Pending",
        order_status: "Placed",
      })
      .select()
      .single();

    if (error) {
      console.error("DB insert error:", error);
      return res.status(500).json({ message: "Order creation failed" });
    }

    // 3️⃣ Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(grandTotal * 100), // paise
      currency: "INR",
      receipt: order.id, // store DB order id
    });

    res.json({
      success: true,
      orderId: order.id,
      razorpayOrder: razorpayOrder,
      bill: {
        subtotal,
        gst,
        grandTotal,
      },
    });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Payment order creation failed" });
  }
};

/**
 * VERIFY PAYMENT
 * payment_status → Paid
 */
export const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    receipt, // DB order ID
  } = req.body;

  try {
    // 1️⃣ Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // 2️⃣ Update order → Paid
    const { data: order, error } = await supabase
      .from("orders")
      .update({
        payment_status: "Paid",
        payment_id: razorpay_payment_id,
        razorpay_order_id:razorpay_order_id
      })
      .eq("id", receipt)
      .select()
      .single();

    if (error) {
      console.error("DB update error:", error);
      return res.status(500).json({
        success: false,
        message: "Order update failed",
      });
    }

    res.json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};
