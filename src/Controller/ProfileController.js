const UserModel = require('../models/UserModel');

class ProfileController {
  static async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await UserModel.findUserById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.render('profile', { user });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
}

module.exports = ProfileController;
