const mongoose = require('mongoose');

const EvidenceSchema = new mongoose.Schema({
  evidenceId: {
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
  },
  type: {
    type: String,
    enum: [
      'Digital',
      'Physical',
      'Financial',
      'Surveillance',
      'Forensic',
      'Document',
      'Image',
      'Video',
      'Audio',
      'Digital Record',
      'Physical Evidence',
      'Other',
    ],
    default: 'Digital Record',
    index: true,
  },
  description: {
    type: String,
    default: '',
  },
  caseId: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  uploadedBy: {
    type: String,
    default: 'Evidence Specialist',
  },
  status: {
    type: String,
    enum: ['Collected', 'In Analysis', 'Verified', 'Archived'],
    default: 'Collected',
    index: true,
  },
  chainOfCustody: [{
    handler: String,
    action: String,
    location: String,
    timestamp: { type: Date, default: Date.now },
  }],
  relatedEntities: [{
    type: String,
    trim: true,
  }],
  relatedTimelineEvents: [{
    type: String,
    trim: true,
  }],
  fileDetails: {
    format: { type: String, default: 'PDF/RAW' },
    size: { type: String, default: '1.2 MB' },
    hash: { type: String, default: 'SHA-256: 4b22...8f9c' },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

EvidenceSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Evidence', EvidenceSchema);
