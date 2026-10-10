const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// add quick logger middleware for this router
router.use((req, res, next) => {
  console.log(`[volunteerAuth] ${req.method} ${req.originalUrl}`);
  next();
});

// POST /api/volunteer/signup
router.post('/signup', async (req, res) => {
  try {
    console.log('[volunteerAuth] signup body:', req.body);
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({
      fullName,
      email: email.toLowerCase(),
      password: hash,
      role: 'volunteer'
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: 'volunteer', email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Signup successful',
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: 'volunteer' }
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: err.message });
  }
});

// POST /api/volunteer/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: 'volunteer', email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: 'volunteer' }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;