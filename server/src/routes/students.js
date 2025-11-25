const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Get all students
router.get('/', studentController.getAllStudents);

// Get student by ID
router.get('/:id', studentController.getStudentById);

module.exports = router;
