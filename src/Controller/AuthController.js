const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const {pool} = require('../config/db');


class AuthController {
  /**
   * User Registration
   */
  static async register(req, res) {
    const { username, email, password } = req.body;
    try {
      // Check if email already exists
      const userCheckQuery = 'SELECT * FROM users WHERE email = $1';
      const existingUser = await pool.query(userCheckQuery, [email]);

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const insertUserQuery =
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email';
      const newUser = await pool.query(insertUserQuery, [username, email, hashedPassword]);

      res.status(201).json({ message: 'Registration successfull', user: newUser.rows[0] });
    } catch (error) {
      console.error('Error in register:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }

  /**
   * User Login
   */
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

      // Get user by email
      const userQuery = 'SELECT * FROM users WHERE email = $1';
      const userResult = await pool.query(userQuery, [email]);

      if (userResult.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const user = userResult.rows[0];

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate JWT Token
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      res.cookie('token', token, { httpOnly: true });
      res.json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  }

  /**
   * User Logout
   */
  static async logout(req, res) {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
  }
}

module.exports = AuthController;


