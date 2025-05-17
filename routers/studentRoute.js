const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/student/register', studentController.createStudent),
router.get('/student/list', studentController.getStudents);

module.exports = router;