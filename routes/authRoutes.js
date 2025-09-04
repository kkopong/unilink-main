import express from 'express';
import { signUpUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signUpUser);
router.post('/login', loginUser);
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

export default router;
