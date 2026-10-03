const Relationship = require('../models/Relationship');
const Activity = require('../models/Activity');

exports.getRelationships = async (req, res) => {
  try {
    const { caseId, entity } = req.query;
    const filter = {};

    if (caseId) filter.caseId = caseId;
    if (entity) {
      filter.$or = [{ sourceEntity: entity }, { targetEntity: entity }];
    }

    const relationships = await Relationship.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: relationships.length, relationships });
  } catch (err) {
    console.error('getRelationships error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving relationships' });
  }
};

exports.createRelationship = async (req, res) => {
  try {
    const { sourceEntity, targetEntity, type, strength, caseId, details, direction } = req.body;

    if (!sourceEntity || !targetEntity) {
      return res.status(400).json({ success: false, message: 'Both source and target entities are required' });
    }

    const count = await Relationship.countDocuments();
    const relationshipId = `REL-${(count + 1).toString().padStart(3, '0')}`;

    const newRel = new Relationship({
      relationshipId,
      sourceEntity: sourceEntity.trim(),
      targetEntity: targetEntity.trim(),
      type: type || 'Associated with',
      strength: strength || 'strong',
      caseId: caseId || '',
      details: details || '',
      direction: direction || 'directed',
    });

    await newRel.save();

    await Activity.create({
      user: req.user && req.user.email ? req.user.email.split('@')[0] : 'Investigator',
      action: 'Relationship Linked',
      caseId: caseId || '',
      details: `Linked "${sourceEntity}" -> "${targetEntity}" (${newRel.type})`,
    });

    res.status(201).json({ success: true, relationship: newRel });
  } catch (err) {
    console.error('createRelationship error:', err);
    res.status(500).json({ success: false, message: 'Server error creating relationship' });
  }
};

exports.deleteRelationship = async (req, res) => {
  try {
    const { id } = req.params;
    const rel = await Relationship.findOne({
      $or: [{ relationshipId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!rel) {
      return res.status(404).json({ success: false, message: 'Relationship not found' });
    }

    await Relationship.deleteOne({ _id: rel._id });
    res.json({ success: true, message: 'Relationship deleted' });
  } catch (err) {
    console.error('deleteRelationship error:', err);
    res.status(500).json({ success: false, message: 'Server error deleting relationship' });
  }
};
