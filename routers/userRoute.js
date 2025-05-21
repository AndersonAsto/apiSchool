const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/user/register', userController.createUser);
router.get('/user/list', userController.getUsers);
router.get('/user/teachers', userController.getOnlyTeachers);
router.put('/user/update/:id', userController.updateUser);
router.delete('/user/delete/:id', userController.deleteStudentById);

module.exports = router;