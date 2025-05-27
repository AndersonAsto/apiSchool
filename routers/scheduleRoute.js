const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.post('/schedule/register', scheduleController.createSchedule);
router.get('/schedule/list', scheduleController.getSchedules);
router.delete('/schedule/delete/:id', scheduleController.deleteStudentById);
router.put('/schedule/update/:id', scheduleController.updateSchedule);

module.exports = router;