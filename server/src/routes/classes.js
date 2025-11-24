const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.get('/', classController.getAllClasses);
router.post('/', classController.createClass);
router.put('/:id', classController.updateClass);
router.delete('/:id', classController.deleteClass);
router.post('/:id/generate-codes', classController.generateCodes);
router.get('/:id/students', classController.getClassStudents);

module.exports = router;
