const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.post('/schedule/register', scheduleController.createSchedule);
router.get('/schedule/list', scheduleController.getSchedules);

module.exports = router;