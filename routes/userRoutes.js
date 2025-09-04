import express from 'express';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Public routes
router.get('/profile', (req, res) => {
  res.json({ message: 'Profile route' });
});

// Protected routes
router.get('/admin', adminAuth, (req, res) => {
  res.json({ message: 'Admin route' });
});

export default router;