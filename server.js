import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: '*', // In production, specify your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Add this before your route definitions
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Add after your routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Add a catch-all route
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
