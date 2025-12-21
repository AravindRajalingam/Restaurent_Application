import { supabase } from '../Config/supabaseClient.js'



//user

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


//user

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


// admin

export const fetchAllOrders = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        created_at,
        payment_status,
        mode,
        total_amount,
        gst_amount,
        grand_total,
        deliveryAddress,
        order_status_logs (
          id,
          status,
          updated_at
        ),
        profiles (
          id,
          name,
          phone,
          address_line,
          city,
          state,
          pincode
        ),
        order_items (
          quantity,
          menu_items (
            id,
            name,
            price,
            image_url,
            categories (
              id,
              name
            )
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
        error: error.message,
      });
    }

    // Shape response
    const shapedOrders = data.map(order => {
      return {
        order: {
          orderId: order.id,
          createdAt: order.created_at,
          paymentStatus: order.payment_status,
          paymentMode: order.mode,
          totals: {
            subtotal: order.total_amount,
            gst: order.gst_amount,
            grandTotal: order.grand_total,
          },
          deliveryAddress: order.deliveryAddress,
          status: order.order_status_logs[0], // single object
        },
        user: order.profiles,
        items: order.order_items.map(item => ({
          quantity: item.quantity,
          itemId: item.menu_items.id,
          name: item.menu_items.name,
          price: item.menu_items.price,
          image: item.menu_items.image_url,
          category: item.menu_items.categories?.name || null,
          itemTotal: item.menu_items.price * item.quantity,
        })),
      };
    });

    return res.status(200).json({
      success: true,
      count: shapedOrders.length,
      data: shapedOrders,
    });

  } catch (err) {
    console.error("Fetch orders error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};






export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;    

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "orderId and status are required",
      });
    }

    // Update order status in Supabase
    const { data, error } = await supabase
      .from("order_status_logs")
      .update({ status: status })
      .eq("order_id", orderId)
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to update order status",
        error: error.message,
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: data[0],
    });
  } catch (err) {
    console.error("Update order status error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}


