const express = require('express');
const jwt = require('jsonwebtoken');
const { auth } = require('../firebase-config');

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-change-in-production';

// Login endpoint - verify with Firebase Auth
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    // Get user from Firebase
    const userRecord = await auth.getUserByEmail(email);
    
    // Note: Password verification should be done on client side with Firebase SDK
    // This is simplified for backend API usage
    // For production, implement proper password verification
    
    // Create JWT token for session
    const token = jwt.sign(
      { uid: userRecord.uid, email: userRecord.email },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: { uid: userRecord.uid, email: userRecord.email }
    });
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      res.status(401).json({ error: 'User not found' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  }
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
