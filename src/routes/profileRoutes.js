const express = require('express');
const ProfileController = require('../Controller/ProfileController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Profile Route (Protected)
router.get('/', authMiddleware, ProfileController.getProfile);

module.exports = router;