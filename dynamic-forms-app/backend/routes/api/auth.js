const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../../models/Admin');
const router = express.Router();

// @route   POST api/auth/register
// @desc    Register admin
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  try {
    let admin = await Admin.findOne({ email });
    if (admin) return res.status(400).json({ msg: 'Admin exists' });

    admin = new Admin({ email, password, name });
    await admin.save();

    const payload = { id: admin.id };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Login admin
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ msg: 'Invalid credentials' });

    const match = await admin.comparePassword(password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { id: admin.id };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
