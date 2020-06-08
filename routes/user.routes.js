const express = require('express');

const UsersController = require('../controllers/UsersController');

const router = express.Router();

router.get('/all/users', UsersController.getAllUsers);
router.get('/user/:userId', UsersController.getSingleUser);
router.post('/user/:userId/update', UsersController.updateUser)
router.post('/user/:userId/delete', UsersController.deleteUser)
module.exports = router;
