// createAdminStandalone.js - Self-contained admin creator
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Supabase client directly
const supabaseUrl = 'https://cgxqithassmcyouqqgtm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNneHFpdGhhc3NtY3lvdXFxZ3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NDUxNjksImV4cCI6MjA2ODEyMTE2OX0.HFM9T52uSvywoz8OjUXaGMR8Vgm0C2PmDMg8fC3S2Xk';
const supabase = createClient(supabaseUrl, supabaseKey);
console.log(supabaseUrl, supabaseKey);
const createAdminUser = async () => {
  try {
    console.log('Starting admin user creation...');
    console.log('Supabase URL:', supabaseUrl ? 'Set' : 'NOT SET');
    console.log('Supabase Key:', supabaseKey ? 'Set' : 'NOT SET');
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your-supabase-url') {
      console.error('❌ Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file');
      return;
    }

    const adminData = {
      name: 'Admin User',
      email: 'admin@unilink.com', // Change this
      password: 'Admin123!', // Change this
      is_admin: true
    };

    console.log('Creating admin with email:', adminData.email);
    
    // Check if admin user already exists
    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('id, email, name, is_admin')
      .eq('email', adminData.email)
      .maybeSingle();

    if (findError) {
      console.error('❌ Error checking existing user:', findError.message);
      return;
    }

    if (existingUser) {
      console.log('User already exists:', existingUser.email);
      
      // Update to admin if not already
      if (!existingUser.is_admin) {
        console.log('Updating user to admin status...');
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ is_admin: true })
          .eq('id', existingUser.id)
          .select()
          .single();

        if (updateError) {
          console.error('❌ Error updating user:', updateError.message);
          return;
        }

        console.log('✅ User updated to admin');
        await generateToken(updatedUser, adminData.password);
      } else {
        console.log('✅ User is already an admin');
        await generateToken(existingUser, adminData.password);
      }
      return;
    }

    // Hash password
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Create admin user
    console.log('Creating new admin user...');
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        name: adminData.name,
        email: adminData.email,
        password: hashedPassword,
        is_admin: true,
        created_at: new Date().toISOString()
      }])
      .select('id, name, email, is_admin, created_at')
      .single();

    if (insertError) {
      console.error('❌ Error creating admin user:', insertError.message);
      
      // Check if it's a duplicate key error
      if (insertError.code === '23505') {
        console.log('User might already exist. Trying to fetch...');
        const { data: fetchUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', adminData.email)
          .single();
        
        if (fetchUser) {
          await generateToken(fetchUser, adminData.password);
        }
      }
      return;
    }

    console.log('✅ Admin user created successfully!');
    console.log('User details:', {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      is_admin: newUser.is_admin
    });

    await generateToken(newUser, adminData.password);

  } catch (error) {
    console.error('❌ Error in createAdminUser:', error.message);
  }
};

const generateToken = async (user, plainPassword) => {
  try {
    console.log('\n--- Generating Token ---');
    
    const JWT_SECRET = process.env.JWT_SECRET || 'unilink_secret';
    console.log('JWT_SECRET:', JWT_SECRET !== 'unilink_secret' ? 'Using env variable' : 'Using default');

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name,
        is_admin: user.is_admin || true
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('\n🎯 SUCCESS! COPY THESE DETAILS:');
    console.log('=====================================');
    console.log('LOGIN CREDENTIALS:');
    console.log('Email:', user.email);
    console.log('Password:', plainPassword);
    console.log('');
    console.log('JWT TOKEN:');
    console.log(token);
    console.log('');
    console.log('THUNDER CLIENT AUTH HEADER:');
    console.log('Authorization: Bearer ' + token);
    console.log('=====================================');

    // Verify token works
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('\n✅ Token verification successful');
      console.log('Token contains:', {
        id: decoded.id,
        email: decoded.email,
        is_admin: decoded.is_admin
      });
    } catch (verifyError) {
      console.error('❌ Token verification failed:', verifyError.message);
    }

  } catch (error) {
    console.error('❌ Error generating token:', error.message);
  }
};

// Run the script
console.log('🚀 Starting admin creation script...');
createAdminUser()
  .then(() => {
    console.log('\n✅ Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });