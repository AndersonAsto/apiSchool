const express = require('express');
const router = express.Router();
const assistanceController = require('../controllers/assistanceController');

router.post('/assistance/register', assistanceController.createAssistance);
router.get('/assistance/filter', assistanceController.getFilteredAssistances);
router.put('/assistance/update/:id', assistanceController.updateAssistance); // Ruta para actualizar por ID (PUT)
router.delete('/assistance/list/:id', assistanceController.deleteAssistance); // Ruta para eliminar por ID (DELETE)
module.exports = router;