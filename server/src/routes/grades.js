const express = require('express');
const router = express.Router();
const gradesController = require('../controllers/gradesController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.get('/', gradesController.getGrades);
router.post('/', gradesController.saveGrade);

module.exports = router;
