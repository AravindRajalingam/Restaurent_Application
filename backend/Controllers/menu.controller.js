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




