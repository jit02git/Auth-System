const {pool} = require('../config/db');
const bcrypt = require('bcrypt');
class UserModel {
  static async createUser(username, email, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [username, email, hashedPassword]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findUserByEmail(email) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findUserByUsername(username) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = {UserModel};