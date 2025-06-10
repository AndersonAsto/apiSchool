const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/student/register', studentController.createStudent),
router.get('/student/list', studentController.getStudents);
router.delete('/student/delete/:id', studentController.deleteStudentById);
router.put('/student/update/:id', studentController.updateStudent);
router.get('/student/by-grade/:gradeId', studentController.getStudentsByGrade);

module.exports = router;