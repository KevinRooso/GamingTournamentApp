const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');

userRouter.get('/users',userController.getAllUsers);
userRouter.get('/users/:id',userController.getUserDetailsById);

module.exports = userRouter