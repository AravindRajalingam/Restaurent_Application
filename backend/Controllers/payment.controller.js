import Razorpay from "razorpay";
import crypto from "crypto";
import { supabase } from "../Config/supabaseClient.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * CALCULATE BILL (API)
 * Frontend can call this if needed
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

export const createPaymentOrder = async (req, res) => {

  // DO NOT read req.body.cartItems

  const { data, error } = await supabase
    .from("cart_items")
    .select(`
        quantity,
        menu_items (
          id,
          price,
          name,
          image_url
        )
      `)
    .eq("user_id", req.user.id);

  if (error) throw error;

  const cart = data.map((c) => ({
    id: c.menu_items.id,
    name: c.menu_items.name,
    image_url: c.menu_items.image_url,
    price: c.menu_items.price,
    qty: c.quantity,
  }));


  if (!cart.length) {
    return res.status(400).json({
      success: false,
      message: "Cart is empty",
    });
  }



  try {
    // 1️⃣ Calculate subtotal from items
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    // 2️⃣ Calculate GST & grand total internally
    const { gst, grandTotal } = calculateBillInternal(subtotal);


    // 3️⃣ Insert order into Supabase
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: req.user.id,
        total_amount: subtotal,
        gst_amount: gst,
        grand_total: grandTotal,
        mode: "online",
        payment_status: "Pending",
        order_status: "Placed",
        deliveryAddress: req.body.deliveryAddress
      })
      .select()
      .single();

    if (error) {
      console.error("DB insert error:", error);
      return res.status(500).json({ message: "Order creation failed" });
    }


    // 4️⃣ Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(grandTotal * 100), // paise
      currency: "INR",
      receipt: order.id,
    });

    res.json({
      success: true,
      orderId: order.id,
      razorpayOrder: razorpayOrder,
      bill: { subtotal, gst, grandTotal },
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
    receipt, // order_id
  } = req.body;

  try {
    /* 1️⃣ Verify Razorpay signature */
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

    /* 2️⃣ Update order → Paid */
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .update({
        payment_status: "Paid",
        payment_id: razorpay_payment_id,
        razorpay_order_id,
        order_status: "Confirmed",
      })
      .eq("id", receipt)
      .select()
      .single();

    if (orderError) throw orderError;

    const { data: cartItems, error: cartError } = await supabase
      .from("cart_items")
      .select(`
        quantity,
        menu_items (
          id,
          price
        )
      `)
      .eq("user_id", order.user_id);

    if (cartError) throw cartError;


    const orderItemsPayload = cartItems.map((item) => ({
      order_id: receipt,
      item_id: item.menu_items.id,
      quantity: item.quantity,
    }));


    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsPayload);

    if (itemsError) throw itemsError;

    /* 5️⃣ Insert into order_status_logs */
    const { error: statusLogError } = await supabase.from("order_status_logs").insert([
      {
        order_id: receipt,
        status: "Payment Successful",
      },
      {
        order_id: receipt,
        status: "Order Confirmed",
      },
    ]);


    if (statusLogError) throw statusLogError;

    /* 6️⃣ Clear cart */
    await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", order.user_id);

    res.json({
      success: true,
      message: "Payment verified & order placed successfully",
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



export const updateFailed = async (req, res) => {
  const {
    orderId // DB order ID
  } = req.body;

  try {

    // 2️⃣ Update order → Failed
    const { data: order, error } = await supabase
      .from("orders")
      .update({
        payment_status: "Failed",
        order_status: "Payment Failed",
      })

      .eq("id", orderId)
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
      message: "Status Upadated successfully",
      order,
    });
  } catch (err) {
    console.error("Status Upadation Failed : ", err);
    res.status(500).json({
      success: false,
      message: "Status Upadation Failed",
    });
  }
};




export const cashOnDelivery = async (req, res) => {
  try {
    /* 1️⃣ Get cart from DB */
    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        quantity,
        menu_items (
          id,
          price,
          name,
          image_url
        )
      `)
      .eq("user_id", req.user.id);

    if (error) throw error;

    const cart = data.map((c) => ({
      item_id: c.menu_items.id,
      name: c.menu_items.name,
      image_url: c.menu_items.image_url,
      price: c.menu_items.price,
      qty: c.quantity,
    }));

    if (!cart.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    /* 2️⃣ Calculate bill */
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    const { gst, grandTotal } = calculateBillInternal(subtotal);

    /* 3️⃣ Create order */
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: req.user.id,
        total_amount: subtotal,
        gst_amount: gst,
        grand_total: grandTotal,
        mode: "cod",
        payment_status: "Pending",
        order_status: "Placed",
      })
      .select()
      .single();

    if (orderError) throw orderError;

    /* 4️⃣ Insert order items */
    const orderItemsPayload = cart.map((item) => ({
      order_id: order.id,
      item_id: item.item_id,
      quantity: item.qty,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsPayload);

    if (itemsError) throw itemsError;

    /* 5️⃣ Insert order status log */
    const { error: statusLogError } = await supabase
      .from("order_status_logs")
      .insert({
        order_id: order.id,
        status: "Order Placed",
      });

    if (statusLogError) throw statusLogError;

    /* 6️⃣ Clear cart */
    await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", req.user.id);

    /* 7️⃣ Response */
    res.json({
      success: true,
      message: "Order placed successfully (Cash on Delivery)",
      orderId: order.id,
      bill: { subtotal, gst, grandTotal },
    });
  } catch (err) {
    console.error("COD error:", err);
    res.status(500).json({
      success: false,
      message: "Cash on delivery order failed",
    });
  }
};

