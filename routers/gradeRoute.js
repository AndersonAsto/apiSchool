const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');

router.post('/grades/register', gradeController.createGrade);
router.get('/grades/list', gradeController.getGrades);
router.delete('/grades/delete/:id', gradeController.deleteGradeById);
router.put('/grades/update/:id', gradeController.updateGrade);

module.exports = router;
