import { supabase } from "../Config/supabaseClient.js"

export const signup = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      phone,
      address_line,
      city,
      state,
      pincode
    } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        name,
        phone,
        address_line,
        city,
        state,
        pincode
      });

    if (profileError) {
      return res.status(400).json({
        success: false,
        message: "Profile creation failed"
      });
    }

    res.json({
      success: true,
      message: "Signup successful. Check your email to verify."
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
};


export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Supabase login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("Login error:", error);
      return res.status(401).json({
        success: false,
        message: error.message || "Invalid email or password",
      });
    }

    if (!data.session) {
      return res.status(401).json({
        success: false,
        message: "User not confirmed or session not available",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });
  } catch (err) {
    console.error("Signin exception:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

