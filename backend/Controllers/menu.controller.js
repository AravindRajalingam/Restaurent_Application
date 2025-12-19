import { supabase } from '../Config/supabaseClient.js'

export const getMenu = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        id,
        name,
        description,
        price,
        image_url,
        categories (
          name
        )
      `)
      .eq('is_available', true)

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      })
    }

    // optional: flatten category name
    const result = data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image_url: item.image_url,
      category: item.categories?.name
    }))

    res.status(200).json({
      success: true,
      data: result
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    })
  }
}




export const getCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select(
        'id,name'
      )

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      })
    }

    res.status(200).json({
      success: true,
      data: data
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    })
  }
}



export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Insert into DB
    const { data, error } = await supabase
      .from("categories")
      .insert([{ name: name.trim() }])
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Category added successfully",
      data: data[0],
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};





