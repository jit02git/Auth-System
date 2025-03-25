const AuthController = require('../Controller/AuthController');
const express = require('express');


const router = express.Router();

// Authentication Routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);

module.exports = router;
