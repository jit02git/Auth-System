const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

class AuthController {
  static async register(req, res) {
    const { username, email, password } = req.body;
    try {
      const existingUser = await UserModel.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      const newUser = await UserModel.createUser(username, email, password);
      console.log(newUser);
      
      res.status(201).json({ message: 'Registration successful', user: newUser });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  static async login(req, res) {
    const { email, password, recaptchaToken } = req.body;
    try {
      // Verify reCAPTCHA
      const recaptchaResponse = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
      );
      if (!recaptchaResponse.data.success) {
        return res.status(400).json({ message: 'Invalid reCAPTCHA. Please try again.' });
      }

      const user = await UserModel.findUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );
      res.cookie('token', token, { httpOnly: true });
      res.json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  static async logout(req, res) {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
  }
}

module.exports = AuthController;