const express = require('express');
const db = require('../db');
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

// Get traffic analytics
router.get('/analytics', verifyToken, (req, res) => {
  const timeframe = req.query.timeframe || '7days'; // 7days, 30days, all
  let whereClause = "WHERE timestamp > datetime('now', '-7 days')";
  
  if (timeframe === '30days') {
    whereClause = "WHERE timestamp > datetime('now', '-30 days')";
  } else if (timeframe === 'all') {
    whereClause = '';
  }

  db.all(`
    SELECT 
      DATE(timestamp) as date,
      COUNT(*) as visits,
      COUNT(DISTINCT ip) as unique_visitors
    FROM traffic
    ${whereClause}
    GROUP BY DATE(timestamp)
    ORDER BY date DESC
  `, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ success: true, dailyStats: rows || [] });
  });
});

// Get top pages/endpoints
router.get('/top-pages', verifyToken, (req, res) => {
  db.all(`
    SELECT 
      endpoint,
      COUNT(*) as visits,
      COUNT(DISTINCT ip) as unique_visitors
    FROM traffic
    WHERE timestamp > datetime('now', '-30 days')
    GROUP BY endpoint
    ORDER BY visits DESC
    LIMIT 20
  `, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ success: true, topPages: rows || [] });
  });
});

// Get referrer statistics
router.get('/referrers', verifyToken, (req, res) => {
  db.all(`
    SELECT 
      referer,
      COUNT(*) as visits
    FROM traffic
    WHERE timestamp > datetime('now', '-30 days') AND referer != 'direct'
    GROUP BY referer
    ORDER BY visits DESC
    LIMIT 20
  `, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ success: true, referrers: rows || [] });
  });
});

// Get browser/user agent statistics
router.get('/browsers', verifyToken, (req, res) => {
  db.all(`
    SELECT 
      CASE 
        WHEN user_agent LIKE '%Chrome%' THEN 'Chrome'
        WHEN user_agent LIKE '%Firefox%' THEN 'Firefox'
        WHEN user_agent LIKE '%Safari%' THEN 'Safari'
        WHEN user_agent LIKE '%Edge%' THEN 'Edge'
        ELSE 'Other'
      END as browser,
      COUNT(*) as visits
    FROM traffic
    WHERE timestamp > datetime('now', '-30 days')
    GROUP BY browser
    ORDER BY visits DESC
  `, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ success: true, browsers: rows || [] });
  });
});

module.exports = router;
