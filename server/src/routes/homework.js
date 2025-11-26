const express = require('express');
const router = express.Router();
const homeworkController = require('../controllers/homeworkController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.get('/', homeworkController.getAllHomework);
router.get('/submissions', homeworkController.getSubmissions);
router.get('/:id', homeworkController.getHomework);
router.post('/', homeworkController.createHomework);
router.put('/:id', homeworkController.updateHomework);
router.delete('/:id', homeworkController.deleteHomework);
router.post('/submissions/grade', homeworkController.gradeSubmission);

module.exports = router;
