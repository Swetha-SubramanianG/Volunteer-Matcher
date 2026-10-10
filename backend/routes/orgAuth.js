const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Organization = require('../models/Organization');

const uploadDir = path.join(__dirname, '..', 'uploads', 'certificates');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`);
  }
});
const upload = multer({ storage });

// POST /api/org/signup
router.post('/signup', upload.single('certificate'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'name, email and password are required' });

    const exists = await Organization.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'Organization with this email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const org = new Organization({
      name,
      email: email.toLowerCase(),
      passwordHash: hash,
      certificatePath: req.file ? `/uploads/certificates/${req.file.filename}` : undefined,
      // For testing you can set approved: true — default is false (requires manual approval)
      approved: process.env.AUTO_APPROVE === 'true' // controlled via .env
    });

    await org.save();

    // return 201 and message. Do NOT auto-return token if not approved.
    if (org.approved) {
      const token = jwt.sign({ id: org._id, role: 'organization', email: org.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({ message: 'Organization created and approved', token, user: { id: org._id, name: org.name, role: 'organization' } });
    }

    return res.status(201).json({ message: 'Organization created. Pending approval by admin.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', detail: err.message });
  }
});

// POST /api/org/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    const org = await Organization.findOne({ email: email.toLowerCase() });
    if (!org) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, org.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    if (!org.approved) return res.status(403).json({ message: 'Organization pending approval' });

    const token = jwt.sign({ id: org._id, role: 'organization', email: org.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: org._id, name: org.name, role: 'organization' } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: 'No token' });
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const org = await Organization.findById(payload.id).select('-passwordHash');
    if (!org) return res.status(404).json({ message: 'User not found' });
    return res.json({ user: { id: org._id, name: org.name, email: org.email, role: 'organization' } });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;