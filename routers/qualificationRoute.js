const express = require('express');
const router = express.Router();
const qualificationController = require('../controllers/qualificationController');

router.post('/qualification/register', qualificationController.createQualification),
router.get('/qualification/list', qualificationController.getQualifications);
router.delete('/qualification/list/:id', qualificationController.deleteQualificationById);
router.put('/qualification/update/:id', qualificationController.updateQualificationById);
router.get('/qualification/filter', qualificationController.getFilteredQualifications);

module.exports = router;