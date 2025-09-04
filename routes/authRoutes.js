import express from 'express';
import { loginUser, signUpUser } from '../controllers/authController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Public routes
router.post('/login', loginUser);
router.post('/register', signUpUser);

// Protected routes that require admin authentication
router.get('/admin/users', adminAuth, async (req, res) => {
  try {
    // Your admin-only route logic here
    res.status(200).json({ message: 'Admin access granted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'auth routes operational' });
});

export default router;
