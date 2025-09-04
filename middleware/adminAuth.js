import jwt from 'jsonwebtoken';
import supabase from '../services/supabaseClient.js';

const adminAuth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No authentication token, access denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'unilink_secret');
    
    // Check if user exists and is admin
    const { data: user, error } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', decoded.id)
      .single();

    if (error || !user || !user.is_admin) {
      return res.status(403).json({ error: 'Not authorized to access this resource' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is invalid' });
  }
};

export default adminAuth;