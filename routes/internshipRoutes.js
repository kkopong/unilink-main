const express = require('express');
const router = express.Router();
const {
  createInternship,
  getAllInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
} = require('../controllers/internshipController');

// GET all internships
router.get('/', getAllInternships);

// GET a single internship by ID
router.get('/:id', getInternshipById);

// POST a new internship
router.post('/', createInternship);

// PUT update an internship
router.put('/:id', updateInternship);

// DELETE an internship
router.delete('/:id', deleteInternship);

module.exports = router;
