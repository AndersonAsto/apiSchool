const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/user/register', userController.createUser);
router.get('/user/list', userController.getUsers);
router.get('/user/teachers', userController.getOnlyTeachers);

module.exports = router;