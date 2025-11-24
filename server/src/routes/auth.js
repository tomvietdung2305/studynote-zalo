const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/login', authController.zaloLogin);

// Protected routes
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
