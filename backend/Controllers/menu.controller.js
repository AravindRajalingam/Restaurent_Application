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

export const getSingleMenuItem = async (req, res) => {
  try {
    const { item_id } = req.params;

    if (!item_id) {
      return res.status(400).json({
        success: false,
        message: "Item ID is required"
      });
    }

    const { data, error } = await supabase
      .from("menu_items")
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
      .eq("id", item_id)
      .eq("is_available", true)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        message: "Item not found"
      });
    }

    const result = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      image_url: data.image_url,
      category: data.categories?.name || null
    };

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};


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


export const searchItem = async (req, res) => {
  try {
    const { item } = req.params;

    if (!item || item.trim().length < 2) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // 🔹 Split input into words
    const keywords = item
      .toLowerCase()
      .split(" ")
      .filter(Boolean); // removes empty words

    const { data, error } = await supabase
      .from("menu_items")
      .select(`
        id,
        name,
        tags,
        categories (
          name
        )
      `);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    const filteredData = data.filter((menu) => {
      const name = menu.name.toLowerCase();
      const category = menu.categories?.name?.toLowerCase() || "";
      const tags = (menu.tags || []).map(t => t.toLowerCase());

      return keywords.some((word) =>
        name.includes(word) ||
        category.includes(word) ||
        tags.some(tag => tag.includes(word))
      );
    });

    res.status(200).json({
      success: true,
      data: filteredData.map(menu => ({
        id: menu.id,
        name: menu.name,
        category: menu.categories?.name || "",
        tags: menu.tags || [],
      })),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



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

    res.status(200).json({
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


export const addMenuItem = async (req, res) => {
  try {
    const { name, description, price, is_available, category_id } = req.body;
    const file = req.file;

    // 🔹 TAGS
    const tags = req.body.tags ? JSON.parse(req.body.tags) : [];

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Menu item name is required",
      });
    }

    if (!price || isNaN(price)) {
      return res.status(400).json({
        success: false,
        message: "Valid price is required",
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    const fileExt = file.originalname.split(".").pop();
    const fileName = `menu-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("MenuItemImages")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      return res.status(400).json({
        success: false,
        message: uploadError.message,
      });
    }

    const { data: publicUrlData } = supabase.storage
      .from("MenuItemImages")
      .getPublicUrl(fileName);

    const image_url = publicUrlData.publicUrl;

    const { data, error } = await supabase
      .from("menu_items")
      .insert([{
        name: name.trim(),
        description,
        price,
        image_url,
        is_available: is_available ?? true,
        category_id,
        tags, // ✅ STORED AS ARRAY
      }])
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Menu item added successfully",
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






