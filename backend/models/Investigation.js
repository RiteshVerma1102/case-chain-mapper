const mongoose = require('mongoose');

const InvestigationSchema = new mongoose.Schema({
  investigationId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  caseId: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Active', 'In Review', 'Concluded', 'Suspended'],
    default: 'Active',
    index: true,
  },
  leadInvestigator: {
    type: String,
    default: 'Senior Investigator',
  },
  objectives: [{
    type: String,
    trim: true,
  }],
  findings: [{
    text: { type: String, required: true },
    author: { type: String, default: 'Investigator' },
    confidence: { type: String, enum: ['Low', 'Medium', 'High', 'Verified'], default: 'High' },
    timestamp: { type: Date, default: Date.now },
  }],
  hypotheses: [{
    text: { type: String, required: true },
    status: { type: String, enum: ['Proposed', 'Evaluating', 'Validated', 'Refuted'], default: 'Evaluating' },
    likelihood: { type: String, enum: ['Low', 'Moderate', 'High'], default: 'Moderate' },
  }],
  tasks: [{
    title: { type: String, required: true },
    assignedTo: { type: String, default: 'Investigator' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    dueDate: { type: Date },
  }],
  notes: [{
    text: { type: String, required: true },
    author: { type: String, default: 'Investigator' },
    createdAt: { type: Date, default: Date.now },
  }],
  activity: [{
    action: { type: String, required: true },
    details: { type: String, default: '' },
    user: { type: String, default: 'System' },
    timestamp: { type: Date, default: Date.now },
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

InvestigationSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Investigation', InvestigationSchema);
