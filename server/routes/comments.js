const express = require('express');
const db = require('../db');

const router = express.Router();

// Post a new comment
router.post('/', (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Prevent very long messages
  if (message.length > 1000) {
    return res.status(400).json({ error: 'Message is too long (max 1000 characters)' });
  }

  db.run(
    'INSERT INTO comments (name, email, message, approved) VALUES (?, ?, ?, ?)',
    [name, email, message, 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to save comment' });
      }

      res.status(201).json({
        success: true,
        message: 'Comment submitted successfully. It will appear after admin approval.',
        id: this.lastID
      });
    }
  );
});

// Get approved comments
router.get('/', (req, res) => {
  db.all(
    'SELECT id, name, email, message, created_at FROM comments WHERE approved = 1 ORDER BY created_at DESC LIMIT 50',
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({
        success: true,
        comments: rows || []
      });
    }
  );
});

module.exports = router;
