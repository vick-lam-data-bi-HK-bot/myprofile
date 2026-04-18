const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const { db, storage } = require('../firebase-config');

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-change-in-production';

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(file.originalname.split('.').pop().toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Middleware to verify admin
const verifyAdmin = (req, res, next) => {
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

// Upload profile picture to Cloud Storage
router.post('/profile-pic', verifyAdmin, upload.single('profilePic'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const bucket = storage.bucket();
    const filename = `profile-pics/${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(filename);

    // Upload file to Cloud Storage
    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype
      }
    });

    // Get signed URL (public access for 6 months)
    const [url] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15778800000
    });

    // Save profile pic URL in Firestore
    await db.collection('profiles').doc('current').set({
      profilePic: url,
      filename: filename,
      updatedAt: new Date(),
      updatedBy: req.user.email
    }, { merge: true });

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      url: url
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
});

// Get latest profile picture
router.get('/profile-pic', async (req, res) => {
  try {
    const doc = await db.collection('profiles').doc('current').get();
    
    if (doc.exists) {
      res.json({
        success: true,
        profilePic: doc.data().profilePic,
        updatedAt: doc.data().updatedAt,
        updatedBy: doc.data().updatedBy
      });
    } else {
      res.json({ success: false, message: 'No profile picture found' });
    }
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch profile picture' });
  }
});

// Get all comments (admin only)
router.get('/comments', verifyAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('comments')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();

    const comments = [];
    snapshot.forEach(doc => {
      comments.push({ id: doc.id, ...doc.data() });
    });

    res.json({ success: true, comments });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Approve/Reject comment
router.post('/comments/:id/approve', verifyAdmin, async (req, res) => {
  try {
    const { approved } = req.body;

    await db.collection('comments').doc(req.params.id).update({
      approved: approved ? true : false
    });

    res.json({
      success: true,
      message: `Comment ${approved ? 'approved' : 'rejected'}`
    });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// Delete comment
router.delete('/comments/:id', verifyAdmin, async (req, res) => {
  try {
    await db.collection('comments').doc(req.params.id).delete();
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// Get dashboard statistics
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const commentsSnapshot = await db.collection('comments').get();
    const comments = [];
    commentsSnapshot.forEach(doc => {
      comments.push({ ...doc.data() });
    });

    const approvedComments = comments.filter(c => c.approved === true).length;
    const pendingComments = comments.filter(c => c.approved !== true).length;
    const totalComments = comments.length;

    res.json({
      success: true,
      stats: {
        approved_comments: approvedComments,
        pending_comments: pendingComments,
        total_comments: totalComments,
        unique_visitors_week: 0, // Implement if tracking traffic
        visits_today: 0
      }
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
