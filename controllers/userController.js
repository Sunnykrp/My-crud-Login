const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

class UserController {
  static async signup(req, res) {
    try {
      const { firstName, lastName, email, password } = req.body;
      const user = await User.create({ firstName, lastName, email, password });
      res.status(201).json({ user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
      console.log(req.body);
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user || !(await user.isValidPassword(password))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = generateToken(user);
      res.json({ token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = UserController;
