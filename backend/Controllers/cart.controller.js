import { supabase } from '../Config/supabaseClient.js'


// GET /cart
export const getCart = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        quantity,
        price,
        menu_items (
          id,
          name,
          image_url
        )
      `)
      .eq("user_id", req.user.id);      

    if (error) throw error;

    // reshape for frontend (same as before)
    const cart = data.map((c) => ({
      id: c.menu_items.id,
      name: c.menu_items.name,
      image_url: c.menu_items.image_url,
      price: c.price,
      qty: c.quantity,
    }));

    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// POST /cart/add
export const addToCart = async (req, res) => {
  try {
    const { item_id, price } = req.body;

    const { error } = await supabase
      .from("cart_items")
      .upsert(
        {
          user_id: req.user.id,
          item_id,
          price,
          quantity: 1,
        },
        { onConflict: "user_id,item_id" }
      );

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// DELETE /cart/remove/:itemId
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", req.user.id)
      .eq("item_id", id);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



export const increaseCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // get current qty
    const { data: cartItem, error: fetchError } = await supabase
      .from("cart_items")
      .select("quantity")
      .eq("item_id", id)
      .eq("user_id", userId)
      .single();

    if (fetchError || !cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // update qty
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity: cartItem.quantity + 1 })
      .eq("item_id", id)
      .eq("user_id",userId);

    if (updateError) {
      return res.status(400).json({
        success: false,
        message: updateError.message,
      });
    }

    res.json({
      success: true,
      message: "Quantity increased",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};




export const decreaseCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // get current qty
    const { data: cartItem, error: fetchError } = await supabase
      .from("cart_items")
      .select("quantity")
      .eq("item_id", id)
      .eq("user_id", userId)
      .single();

    if (fetchError || !cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    // if qty = 1 → delete row
    if (cartItem.quantity === 1) {
      const { error: deleteError } = await supabase
        .from("cart_items")
        .delete()
        .eq("item_id", id)
        .eq("user_id",userId);

      if (deleteError) {
        return res.status(400).json({
          success: false,
          message: deleteError.message,
        });
      }

      return res.json({
        success: true,
        message: "Item removed from cart",
      });
    }

    // else decrease qty
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity: cartItem.quantity - 1 })
      .eq("item_id", id)
      .eq("user_id",userId);

    if (updateError) {
      return res.status(400).json({
        success: false,
        message: updateError.message,
      });
    }

    res.json({
      success: true,
      message: "Quantity decreased",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};


