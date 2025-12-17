import { supabase } from '../config/supabaseClient.js'

export const signup = async (req, res) => {
  const {
    email,
    password,
    name,
    phone,
    address_line,
    city,
    state,
    pincode
  } = req.body

  // 1. Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) return res.status(400).json(error)

  // 2. Store profile + address
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: data.user.id,
      name,
      phone,
      address_line,
      city,
      state,
      pincode
    })

  if (profileError) return res.status(400).json(profileError)

  res.json({
    message: 'Signup successful',
    user_id: data.user.id
  })
}

export const signin = async (req, res) => {
  const { email, password } = req.body

  // Supabase login
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    console.log('Login error:', error)
    return res.status(401).json({
      message: 'Invalid email or password'
    })
  }

  res.json({
    message: 'Login successful',
    user: {
      id: data.user.id,
      email: data.user.email
    },
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token
  })
}
