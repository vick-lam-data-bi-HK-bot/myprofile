const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth-firebase');
const adminRoutes = require('./routes/admin-firebase');
const commentsRoutes = require('./routes/comments-firebase');
const trafficRoutes = require('./routes/traffic-firebase');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/traffic', trafficRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), database: 'firebase' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ CMS Server running on http://localhost:${PORT}`);
  console.log(`✅ Connected to Firebase Firestore`);
});
