const express = require('express');
const { signup, signin, getUser, logout } = require('../controller/authController');
const jwtAuth = require('../middleware/jwtAuth');

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.get('/user',  jwtAuth, getUser) // pahle autenticate karenge jwt token se phir info nikalenge phir get user ko bhejenge.
authRouter.get('/logout', jwtAuth, logout)

module.exports = authRouter;