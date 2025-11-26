const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.get('/dashboard', statisticsController.getDashboardStats);
router.get('/attendance', statisticsController.getAttendanceStats);
router.get('/grades', statisticsController.getGradeDistribution);
router.get('/comparison', statisticsController.getClassComparison);

module.exports = router;
