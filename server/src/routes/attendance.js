const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.get('/', attendanceController.getAttendance);
router.post('/', attendanceController.saveAttendance);
router.get('/history', attendanceController.getAttendanceHistory);

module.exports = router;
