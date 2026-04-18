const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-change-in-production';

// Login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  db.get(
    'SELECT * FROM admins WHERE username = ?',
    [username],
    (err, admin) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const passwordMatch = bcryptjs.compareSync(password, admin.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: admin.id, username: admin.username },
        SECRET_KEY,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token,
        user: { id: admin.id, username: admin.username }
      });
    }
  );
});

// Verify token middleware
router.use((req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token && req.path !== '/login') {
    return res.status(401).json({ error: 'No token provided' });
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded;
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }

  next();
});

// Verify endpoint
router.get('/verify', (req, res) => {
  if (req.user) {
    res.json({ valid: true, user: req.user });
  } else {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
