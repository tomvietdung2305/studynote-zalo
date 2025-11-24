const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');

// Protect all routes
router.use(authMiddleware);

// Send notification
router.post('/send', notificationController.sendNotification);

module.exports = router;
