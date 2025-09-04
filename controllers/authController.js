import supabase from '../services/supabaseClient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signUpUser = async (req, res) => {
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
  const hashedPassword = await bcrypt.hash(password, 10);

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

  res.json({ user: data, token });
};

export const loginUser = async (req, res) => {
  
  const { email, password } = req.body;
console.log(req)
  // Find user by email
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
    console.log("User is ",user)

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
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'unilink_secret',
    { expiresIn: '7d' }
  );

  // Send session and user info back to client
  res.status(200).json({
    message: 'Login successful',
    //dsession: data.session,
    user: user,
  });
};