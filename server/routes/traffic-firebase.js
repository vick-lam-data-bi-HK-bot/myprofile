const express = require('express');
const jwt = require('jsonwebtoken');
const { db } = require('../firebase-config');

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

// Log traffic (public endpoint - called automatically)
router.post('/log', async (req, res) => {
  try {
    const { endpoint, method, userAgent, referer } = req.body;
    const ip = req.ip || req.connection.remoteAddress;

    await db.collection('traffic').add({
      ip,
      endpoint,
      method,
      user_agent: userAgent,
      referer: referer || 'direct',
      timestamp: new Date()
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Traffic log error:', err);
    // Don't fail the request if logging fails
    res.json({ success: false });
  }
});

// Get traffic analytics (admin only)
router.get('/analytics', verifyToken, async (req, res) => {
  try {
    const timeframe = req.query.timeframe || '7days';
    let startDate = new Date();

    if (timeframe === '7days') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeframe === '30days') {
      startDate.setDate(startDate.getDate() - 30);
    } else {
      startDate = new Date('2000-01-01');
    }

    const snapshot = await db.collection('traffic')
      .where('timestamp', '>=', startDate)
      .get();

    // Group by date
    const dailyStats = {};
    const uniqueIPs = new Set();

    snapshot.forEach(doc => {
      const data = doc.data();
      const date = data.timestamp.toDate().toISOString().split('T')[0];

      if (!dailyStats[date]) {
        dailyStats[date] = { date, visits: 0, unique_visitors: new Set() };
      }

      dailyStats[date].visits++;
      dailyStats[date].unique_visitors.add(data.ip);
      uniqueIPs.add(data.ip);
    });

    // Convert Sets to counts
    const stats = Object.values(dailyStats).map(stat => ({
      date: stat.date,
      visits: stat.visits,
      unique_visitors: stat.unique_visitors.size
    }));

    res.json({ success: true, dailyStats: stats });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get top pages
router.get('/top-pages', verifyToken, async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const snapshot = await db.collection('traffic')
      .where('timestamp', '>=', startDate)
      .get();

    const pageStats = {};

    snapshot.forEach(doc => {
      const data = doc.data();
      const endpoint = data.endpoint;

      if (!pageStats[endpoint]) {
        pageStats[endpoint] = { endpoint, visits: 0, unique_visitors: new Set() };
      }

      pageStats[endpoint].visits++;
      pageStats[endpoint].unique_visitors.add(data.ip);
    });

    const topPages = Object.values(pageStats)
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 20)
      .map(page => ({
        endpoint: page.endpoint,
        visits: page.visits,
        unique_visitors: page.unique_visitors.size
      }));

    res.json({ success: true, topPages });
  } catch (err) {
    console.error('Top pages error:', err);
    res.status(500).json({ error: 'Failed to fetch top pages' });
  }
});

// Get referrers
router.get('/referrers', verifyToken, async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const snapshot = await db.collection('traffic')
      .where('timestamp', '>=', startDate)
      .get();

    const referrerStats = {};

    snapshot.forEach(doc => {
      const data = doc.data();
      const referer = data.referer || 'direct';

      if (referer !== 'direct') {
        referrerStats[referer] = (referrerStats[referer] || 0) + 1;
      }
    });

    const referrers = Object.entries(referrerStats)
      .map(([referer, visits]) => ({ referer, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 20);

    res.json({ success: true, referrers });
  } catch (err) {
    console.error('Referrers error:', err);
    res.status(500).json({ error: 'Failed to fetch referrers' });
  }
});

// Get browsers
router.get('/browsers', verifyToken, async (req, res) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const snapshot = await db.collection('traffic')
      .where('timestamp', '>=', startDate)
      .get();

    const browserStats = {};

    snapshot.forEach(doc => {
      const userAgent = doc.data().user_agent || 'Unknown';
      let browser = 'Other';

      if (userAgent.includes('Chrome')) browser = 'Chrome';
      else if (userAgent.includes('Firefox')) browser = 'Firefox';
      else if (userAgent.includes('Safari')) browser = 'Safari';
      else if (userAgent.includes('Edge')) browser = 'Edge';

      browserStats[browser] = (browserStats[browser] || 0) + 1;
    });

    const browsers = Object.entries(browserStats)
      .map(([browser, visits]) => ({ browser, visits }))
      .sort((a, b) => b.visits - a.visits);

    res.json({ success: true, browsers });
  } catch (err) {
    console.error('Browsers error:', err);
    res.status(500).json({ error: 'Failed to fetch browser stats' });
  }
});

module.exports = router;
