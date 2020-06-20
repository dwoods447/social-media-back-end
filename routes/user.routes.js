const express = require('express');

const UsersController = require('../controllers/UsersController');

const router = express.Router();

const isAuthenticated = require('../middleware/isAuthenticated')



router.get('/all/users', UsersController.getAllUsers);
router.get('/user/:userId', UsersController.getSingleUser);
router.post('/user/:userId/update', UsersController.updateUser);
router.post('/user/:userId/delete', UsersController.deleteUser);
router.post('/image/upload', isAuthenticated, UsersController.uploadImage);
//router.post('/follow/user', isAuthenticated, followUser);
//router.post('/unfollow/user', isAuthenticated, unFollowUser);
module.exports = router;
