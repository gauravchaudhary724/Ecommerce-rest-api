const express = require('express');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware'); // ✅ Add this line

const router = express.Router();

// ✅ REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  try {
    const user = new User({ name, email, password });
    await user.save();
    const token = user.generateAuthToken();
    res.status(201).json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err });
  }
});

// ✅ LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = user.generateAuthToken();
    res.status(200).json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err });
  }
});

// ✅ PROTECTED ROUTE
router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    name: req.user.name,
    email: req.user.email,
  });
});

module.exports = router;
