import Razorpay from 'razorpay'
import crypto from 'crypto'
import { supabase } from '../config/supabaseClient.js'
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
  const { amount } = req.body   // amount in INR

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`
    })

    res.json(order)
  } catch (err) {
    res.status(500).json({ message: 'Payment order failed' })
  }
}

/**
 * VERIFY PAYMENT SIGNATURE
 */
export const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId   // your DB order id
  } = req.body

  const body = razorpay_order_id + '|' + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: 'Payment verification failed' })
  }

  // Update order payment status
  await supabase
    .from('orders')
    .update({
      payment_status: 'Paid',
      payment_id: razorpay_payment_id
    })
    .eq('id', orderId)

  res.json({ message: 'Payment verified successfully' })
}
