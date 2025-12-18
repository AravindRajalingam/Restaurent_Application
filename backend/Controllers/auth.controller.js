import { supabase } from "../Config/supabaseClient.js"
// import jwt from "jsonwebtoken";

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

export const getMe = async (req, res) => {
  try {
    // 1️⃣ Get token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // 2️⃣ Validate token & get auth user
    const { data: authData, error: authError } =
      await supabase.auth.getUser(token);

    if (authError || !authData?.user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = authData.user.id;

    // 3️⃣ Get profile data using user ID
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", userId)
      .single();

    if (profileError) {
      return res.status(500).json({
        message: "Profile not found",
      });
    }

    // 4️⃣ Send clean response to frontend
    res.json({
      user: {
        id: userId,
        email: authData.user.email,
        name: profile.name,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};