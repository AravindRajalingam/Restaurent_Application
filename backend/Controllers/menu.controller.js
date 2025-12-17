import { supabase } from '../Config/supabaseClient.js'

export const getMenu = async (req, res) => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('id, name, description, price, image_url')
    .eq('is_available', true)

  if (error) return res.status(400).json(error)
  res.json(data)
}
