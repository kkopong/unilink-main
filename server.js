import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js'
import postRoutes from './routes/postRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // Example admin routes
app.use('/api/users/posts', postRoutes); // Example user routes

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// app.post('/api/create-admin', async (req, res) => {
//   try {
//     console.log('Creating admin user via API...');
    
//     const adminEmail = 'admin@unilink.com'; // Change this
//     const adminPassword = 'Admin123!'; // Change this
    
//     // Check if admin already exists
//     const { data: existingUser } = await supabase
//       .from('users')
//       .select('*')
//       .eq('email', adminEmail)
//       .maybeSingle();

//     if (existingUser) {
//       // Update to admin if not already
//       const { data: updatedUser, error: updateError } = await supabase
//         .from('users')
//         .update({ is_admin: true })
//         .eq('email', adminEmail)
//         .select()
//         .single();

//       if (updateError) {
//         return res.status(500).json({ error: updateError.message });
//       }

//       // Generate token
//       const token = jwt.sign(
//         { 
//           id: updatedUser.id, 
//           email: updatedUser.email, 
//           name: updatedUser.name,
//           is_admin: true
//         },
//         process.env.JWT_SECRET || 'unilink_secret',
//         { expiresIn: '7d' }
//       );

//       return res.json({
//         message: 'Admin user updated',
//         user: updatedUser,
//         token: token,
//         credentials: {
//           email: adminEmail,
//           password: adminPassword
//         }
//       });
//     }

//     // Create new admin
//     const salt = await bcrypt.genSalt(12);
//     const hashedPassword = await bcrypt.hash(adminPassword, salt);

//     const { data: newUser, error: insertError } = await supabase
//       .from('users')
//       .insert([{
//         name: 'Admin User',
//         email: adminEmail,
//         password: hashedPassword,
//         is_admin: true
//       }])
//       .select()
//       .single();

//     if (insertError) {
//       return res.status(500).json({ error: insertError.message });
//     }

//     // Generate token
//     const token = jwt.sign(
//       { 
//         id: newUser.id, 
//         email: newUser.email, 
//         name: newUser.name,
//         is_admin: true
//       },
//       process.env.JWT_SECRET || 'unilink_secret',
//       { expiresIn: '7d' }
//     );

//     res.json({
//       message: 'Admin user created successfully',
//       user: {
//         id: newUser.id,
//         name: newUser.name,
//         email: newUser.email,
//         is_admin: newUser.is_admin
//       },
//       token: token,
//       credentials: {
//         email: adminEmail,
//         password: adminPassword
//       }
//     });

//   } catch (error) {
//     console.error('Error creating admin:', error);
//     res.status(500).json({ error: error.message });
//   }
// });