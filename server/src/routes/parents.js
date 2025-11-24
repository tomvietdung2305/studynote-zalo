const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const authMiddleware = require('../middleware/auth');

// Protect all routes
router.use(authMiddleware);

// Connect via code
router.post('/connect', parentController.connectParent);

// Get connected children
router.get('/children', parentController.getChildren);

module.exports = router;
