const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  alertId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['critical', 'warning', 'info', 'high'],
    default: 'info',
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  caseId: {
    type: String,
    default: '',
    trim: true,
  },
  relatedCases: [{
    type: String,
    trim: true,
  }],
  category: {
    type: String,
    default: 'General',
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Alert', AlertSchema);
