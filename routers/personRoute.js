const express = require('express');
const router = express.Router();
const personController = require('../controllers/personController');

router.post('/person/register', personController.createPerson);
router.get('/person/list', personController.getPersons);
router.delete('/person/delete/:id', personController.deletePersonById);
router.put('/person/update/:id', personController.updatePerson);

module.exports = router;