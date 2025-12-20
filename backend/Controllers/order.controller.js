import { supabase } from '../Config/supabaseClient.js'

/**
 * PLACE ORDER - CASH ON DELIVERY
 */
// export const placeOrder = async (req, res) => {
//   const { items, total, gst, grandTotal } = req.body

//   if (!items || items.length === 0) {
//     return res.status(400).json({ message: 'Cart is empty' })
//   }

//   // 1️⃣ Create order (COD)
//   const { data: order, error } = await supabase
//     .from('orders')
//     .insert({
//       user_id: req.user.id,
//       total_amount: total,
//       gst_amount: gst,
//       grand_total: grandTotal,
//       payment_status: 'COD',
//       order_status: 'Placed'
//     })
//     .select()
//     .single()

//   if (error) {
//     return res.status(400).json(error)
//   }

//   // 2️⃣ Insert ordered items
//   const orderItems = items.map(i => ({
//     order_id: order.id,
//     item_id: i.id,
//     quantity: i.quantity,
//     price: i.price
//   }))

//   const { error: itemsError } = await supabase
//     .from('order_items')
//     .insert(orderItems)

//   if (itemsError) {
//     return res.status(400).json(itemsError)
//   }

//   // 3️⃣ Initial status log
//   await supabase.from('order_status_logs').insert({
//     order_id: order.id,
//     status: 'Placed'
//   })

//   res.json({
//     message: 'Order placed successfully (Cash on Delivery)',
//     orderId: order.id
//   })
// }

/**
 * USER ORDER HISTORY
 */

export const myOrders = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(200).json({
      success: true,
      orders: data, // key 'orders' for frontend mapping
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};


/**
 * LIVE ORDER STATUS
 */
export const orderStatus = async (req, res) => {
  const { orderId } = req.params

  const { data, error } = await supabase
    .from('order_status_logs')
    .select('*')
    .eq('order_id', orderId)
    .order('updated_at', { ascending: true })

  if (error) return res.status(400).json(error)

  res.json(data)
}
