const express = require('express');
const { db } = require('../firebase-config');

const router = express.Router();

// Post a new comment (public endpoint)
router.post('/', async (req, res) => {
  try {
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

    // Add comment to Firestore
    const docRef = await db.collection('comments').add({
      name,
      email,
      message,
      approved: false,
      createdAt: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Comment submitted successfully. It will appear after admin approval.',
      id: docRef.id
    });
  } catch (err) {
    console.error('Comment save error:', err);
    res.status(500).json({ error: 'Failed to save comment' });
  }
});

// Get approved comments (public endpoint)
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('comments')
      .where('approved', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const comments = [];
    snapshot.forEach(doc => {
      comments.push({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
        message: doc.data().message,
        created_at: doc.data().createdAt
      });
    });

    res.json({
      success: true,
      comments
    });
  } catch (err) {
    console.error('Fetch comments error:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

module.exports = router;
