const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');

router.post('/grade/register', gradeController.createGrade);
router.get('/grade/list', gradeController.getGrades);
router.delete('/grade/delete/:id', gradeController.deleteGradeById);
router.put('/grade/update/:id', gradeController.updateGrade);

module.exports = router;
