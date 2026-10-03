require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/casechain';
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected successfully to CaseChain');
    // Check if initial cases exist, if not, auto-seed
    try {
      const Case = require('./models/Case');
      const count = await Case.countDocuments();
      if (count === 0) {
        console.log('No cases found in database. Auto-seeding initial CaseChain demo data...');
        const seedController = require('./controllers/seedController');
        await seedController.seedDatabase({ body: {} }, { json: () => {} });
        console.log('Auto-seed completed successfully!');
      }
    } catch (seedErr) {
      console.error('Auto-seed check error:', seedErr);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.log('Operating in resilient mode. Database operations will attempt to reconnect.');
  });

// Mount CaseChain API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/cases', require('./routes/caseRoutes'));
app.use('/api/entities', require('./routes/entityRoutes'));
app.use('/api/relationships', require('./routes/relationshipRoutes'));
app.use('/api/investigations', require('./routes/investigationRoutes'));
app.use('/api/evidence', require('./routes/evidenceRoutes'));
app.use('/api/timeline', require('./routes/timelineRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/seed', require('./routes/seedRoutes'));

// Global error handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`CaseChain backend server running on port ${PORT}`);
});

