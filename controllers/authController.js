import supabase from '../services/supabaseClient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signUpUser = async (req, res) => {
  console.log("Signing up user...");
  
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Name, email, and password are required.' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Please provide a valid email address.' 
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long.' 
      });
    }

    console.log("Checking for existing user with email:", email);

    // Check if user already exists - handle the case where no user is found
    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle(); // Use maybeSingle instead of single to avoid error when no user found

    // Handle database query errors
    if (findError) {
      console.error("Error checking existing user:", findError);
      return res.status(500).json({ 
        error: 'Database error occurred while checking existing user.' 
      });
    }

    // If user exists, return error
    if (existingUser) {
      console.log("User already exists with email:", email);
      return res.status(400).json({ 
        error: 'Email already registered. Please use a different email or try logging in.' 
      });
    }

    console.log("Hashing password...");
    // Hash the password
    const salt = await bcrypt.genSalt(12); // Increased salt rounds for better security
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("Creating new user...");
    // Insert user into users table
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        { 
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
          is_admin: false, // Explicitly set default admin status
          created_at: new Date().toISOString()
        }
      ])
      .select('id, name, email, is_admin, created_at') // Don't return password
      .single();

    if (insertError) {
      console.error("Error creating user:", insertError);
      return res.status(500).json({ 
        error: 'Failed to create user account. Please try again.' 
      });
    }

    if (!newUser) {
      console.error("User creation failed - no data returned");
      return res.status(500).json({ 
        error: 'User creation failed. Please try again.' 
      });
    }

    console.log("User created successfully:", newUser.id);

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email, 
        name: newUser.name,
        is_admin: newUser.is_admin || false
      },
      process.env.JWT_SECRET || 'unilink_secret',
      { expiresIn: '7d' }
    );

    console.log("JWT token generated successfully");

    // Return success response
    res.status(201).json({ 
      success: true,
      message: 'User account created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        is_admin: newUser.is_admin || false,
        created_at: newUser.created_at
      }, 
      token 
    });

  } catch (error) {
    console.error("Signup error:", error);
    
    // Handle specific error types
    if (error.code === '23505') { // PostgreSQL unique violation
      return res.status(400).json({ 
        error: 'Email already registered. Please use a different email.' 
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Invalid input data provided.' 
      });
    }
    console.log(res)
    // Generic error response
    res.status(500).json({ 
      error: 'An unexpected error occurred. Please try again later.' 
    });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Compare password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'unilink_secret',
      { expiresIn: '24h' }
    );

    // Send session and user info back to client
    res.status(200).json({
      message: 'Login successful',
      user: user,
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};