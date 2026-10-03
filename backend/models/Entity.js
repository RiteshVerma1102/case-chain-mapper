const mongoose = require('mongoose');

const EntitySchema = new mongoose.Schema({
  entityId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
    enum: [
      'Person',
      'Organization',
      'Location',
      'Event',
      'Document',
      'Evidence',
      'Transaction',
      'Vehicle',
      'Phone',
      'Email',
      'Other',
    ],
    default: 'Person',
    index: true,
  },
  description: {
    type: String,
    default: '',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  relatedCases: [{
    type: String,
    trim: true,
    index: true,
  }],
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

EntitySchema.pre('save', function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Entity', EntitySchema);
