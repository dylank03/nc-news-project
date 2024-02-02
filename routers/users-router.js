const userRouter = require('express').Router();
const {getAllUsers} = require('../controllers/usersController');

userRouter.get('/', getAllUsers)

module.exports = userRouter