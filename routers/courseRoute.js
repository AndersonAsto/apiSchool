const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.post('/course/register', courseController.createCourse);
router.get('/course/list', courseController.getCourses);
router.delete('/course/delete/:id', courseController.deleteCourseById);
router.put('/course/update/:id', courseController.updateCourse);

module.exports = router;