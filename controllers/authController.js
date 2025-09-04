import supabase from '../services/supabaseClient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signUpUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into users table
    const { data, error } = await supabase
      .from('users')
      .insert([
        { name, email, password: hashedPassword }
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: data.id, email: data.email, name: data.name },
      process.env.JWT_SECRET || 'unilink_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({ user: data, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
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