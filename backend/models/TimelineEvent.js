const mongoose = require('mongoose');

const TimelineEventSchema = new mongoose.Schema({
  eventId: {
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
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  time: {
    type: String,
    default: '12:00 PM',
  },
  eventType: {
    type: String,
    enum: [
      'Contact',
      'Transaction',
      'Movement',
      'Evidence Upload',
      'Finding Added',
      'Incident',
      'Interview',
      'Communication',
      'Other',
    ],
    default: 'Incident',
    index: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  relatedEntity: {
    type: String,
    default: '',
    trim: true,
  },
  relatedEvidence: {
    type: String,
    default: '',
    trim: true,
  },
  location: {
    type: String,
    default: '',
  },
  createdBy: {
    type: String,
    default: 'Field Investigator',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('TimelineEvent', TimelineEventSchema);
