const express = require('express');
const ProfileController = require('../Controller/ProfileController');
const authMiddleware = require('../middlewares/authMiddleware');

const profileRouter = express.Router();

// Profile Route (Protected)
profileRouter.get('/', authMiddleware, ProfileController.getProfile);

module.exports = profileRouter;