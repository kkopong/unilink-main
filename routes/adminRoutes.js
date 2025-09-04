import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import { createPost, getAllPosts, deletePost } from '../controllers/postController.js';
import { createNews, getAllNews, deleteNews } from '../controllers/newController.js';
import { createInternship, getAllInternships, deleteInternship } from '../controllers/internshipController.js';

const router = express.Router();

// Apply adminAuth middleware to all routes
router.use(adminAuth);

// Posts routes
router.post('/posts', createPost);
router.get('/posts', getAllPosts);
router.delete('/posts/:id', deletePost);

// News routes
router.post('/news', createNews);
router.get('/news', getAllNews);
router.delete('/news/:id', deleteNews);

// Internship routes
router.post('/internships', createInternship);
router.get('/internships', getAllInternships);
router.delete('/internships/:id', deleteInternship);

export default router;