const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Zalo webhook endpoint (no auth required for webhooks)
router.post('/zalo', webhookController.handleZaloWebhook);
router.get('/zalo', webhookController.verifyWebhook);

module.exports = router;
