const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  user: {
    type: String,
    default: 'Investigator',
  },
  action: {
    type: String,
    required: true,
  },
  caseId: {
    type: String,
    default: '',
    index: true,
  },
  entityId: {
    type: String,
    default: '',
  },
  details: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

module.exports = mongoose.model('Activity', ActivitySchema);
