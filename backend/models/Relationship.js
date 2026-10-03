const mongoose = require('mongoose');

const RelationshipSchema = new mongoose.Schema({
  relationshipId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  sourceEntity: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  targetEntity: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
    enum: [
      'Associated with',
      'Contacted',
      'Owned by',
      'Located at',
      'Related to',
      'Transferred to',
      'Mentioned in',
      'Connected through',
      'Evidence of',
    ],
    default: 'Associated with',
    index: true,
  },
  strength: {
    type: String,
    enum: ['strong', 'moderate', 'weak'],
    default: 'strong',
  },
  caseId: {
    type: String,
    trim: true,
    index: true,
  },
  details: {
    type: String,
    default: '',
  },
  direction: {
    type: String,
    enum: ['directed', 'undirected'],
    default: 'directed',
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

RelationshipSchema.pre('save', function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Relationship', RelationshipSchema);
