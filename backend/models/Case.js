const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  caseId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: 'Investigation',
    enum: ['Theft', 'Fraud', 'Cyber', 'Narcotics', 'Homicide', 'Vandalism', 'Financial', 'Intelligence', 'Investigation', 'Other'],
  },
  priority: {
    type: String,
    enum: ['Critical', 'High', 'Medium', 'Low'],
    default: 'Medium',
    index: true,
  },
  status: {
    type: String,
    enum: ['New', 'Under Investigation', 'On Hold', 'Resolved', 'Closed'],
    default: 'Under Investigation',
    index: true,
  },
  suspectName: {
    type: String,
    default: 'Unknown',
    trim: true,
    index: true,
  },
  investigator: {
    type: String,
    default: 'Lead Investigator',
    trim: true,
  },
  deadline: {
    type: Date,
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 15,
  },
  location: {
    type: String,
    default: 'Metro District',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  notes: [{
    content: String,
    author: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
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

CaseSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Case', CaseSchema);
