const express = require('express');
const db = require('../db');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-change-in-production';

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Upload profile picture
router.post('/profile-pic', verifyToken, upload.single('profilePic'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageBuffer = req.file.buffer;
  const imageBase64 = 'data:' + req.file.mimetype + ';base64,' + imageBuffer.toString('base64');

  db.run(
    'INSERT INTO profile_data (profile_pic, updated_by) VALUES (?, ?)',
    [imageBase64, req.user.username],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to save profile picture' });
      }

      res.json({
        success: true,
        message: 'Profile picture updated successfully',
        id: this.lastID
      });
    }
  );
});

// Get latest profile picture
router.get('/profile-pic', (req, res) => {
  db.get(
    'SELECT * FROM profile_data ORDER BY profile_pic_updated_at DESC LIMIT 1',
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (row) {
        res.json({
          success: true,
          profilePic: row.profile_pic,
          updatedAt: row.profile_pic_updated_at,
          updatedBy: row.updated_by
        });
      } else {
        res.json({ success: false, message: 'No profile picture found' });
      }
    }
  );
});

// Get all comments (for admin review)
router.get('/comments', verifyToken, (req, res) => {
  db.all(
    'SELECT * FROM comments ORDER BY created_at DESC LIMIT 100',
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ success: true, comments: rows || [] });
    }
  );
});

// Approve/Reject comment
router.post('/comments/:id/approve', verifyToken, (req, res) => {
  const { approved } = req.body;

  db.run(
    'UPDATE comments SET approved = ? WHERE id = ?',
    [approved ? 1 : 0, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update comment' });
      }

      res.json({
        success: true,
        message: `Comment ${approved ? 'approved' : 'rejected'}`
      });
    }
  );
});

// Delete comment
router.delete('/comments/:id', verifyToken, (req, res) => {
  db.run(
    'DELETE FROM comments WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete comment' });
      }

      res.json({ success: true, message: 'Comment deleted' });
    }
  );
});

// Get admin dashboard stats
router.get('/stats', verifyToken, (req, res) => {
  db.all(`
    SELECT 
      (SELECT COUNT(*) FROM comments WHERE approved = 1) as approved_comments,
      (SELECT COUNT(*) FROM comments WHERE approved = 0) as pending_comments,
      (SELECT COUNT(*) FROM comments) as total_comments,
      (SELECT COUNT(DISTINCT ip) FROM traffic WHERE timestamp > datetime('now', '-7 days')) as unique_visitors_week,
      (SELECT COUNT(*) FROM traffic WHERE timestamp > datetime('now', '-1 day')) as visits_today
  `, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ success: true, stats: rows[0] || {} });
  });
});

module.exports = router;
