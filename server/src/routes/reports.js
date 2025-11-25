const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Generate AI-enhanced report
router.post('/generate', reportController.generateReport);

// Get student reports history
router.get('/student/:studentId', reportController.getStudentReports);

// Get specific report
router.get('/:reportId', reportController.getReportById);

// Send report to parent
router.post('/:reportId/send', reportController.sendReportToParent);

// Update report
router.put('/:reportId', reportController.updateReport);

module.exports = router;
