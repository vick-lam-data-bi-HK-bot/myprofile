const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const commentsRoutes = require('./routes/comments');
const trafficRoutes = require('./routes/traffic');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Track traffic
app.use((req, res, next) => {
  const db = require('./db');
  const userAgent = req.get('user-agent');
  const referer = req.get('referer') || 'direct';
  const ip = req.ip || req.connection.remoteAddress;
  
  db.run(
    'INSERT INTO traffic (ip, endpoint, method, user_agent, referer) VALUES (?, ?, ?, ?, ?)',
    [ip, req.path, req.method, userAgent, referer]
  );
  
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/traffic', trafficRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ CMS Server running on http://localhost:${PORT}`);
});
