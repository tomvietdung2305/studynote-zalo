const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.get('/', scheduleController.getExams);
router.get('/:id', scheduleController.getExam);
router.post('/', scheduleController.createExam);
router.put('/:id', scheduleController.updateExam);
router.delete('/:id', scheduleController.deleteExam);

module.exports = router;
