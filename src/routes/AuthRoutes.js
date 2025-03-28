const AuthController = require('../Controller/AuthController');
const express = require('express');


const authRouter = express.Router();

// Authentication Routes
authRouter.post('/register', AuthController.register);
authRouter.post('/login', AuthController.login);
authRouter.post('/logout', AuthController.logout);

module.exports = authRouter;
