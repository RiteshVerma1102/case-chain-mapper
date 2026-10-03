const Entity = require('../models/Entity');
const Relationship = require('../models/Relationship');
const Case = require('../models/Case');
const Activity = require('../models/Activity');

// Helper: generate next unique Entity ID
const generateNextEntityId = async () => {
  const count = await Entity.countDocuments();
  return `ENT-${(count + 1).toString().padStart(3, '0')}`;
};

// GET /api/entities
exports.getEntities = async (req, res) => {
  try {
    const { search, type, riskLevel, caseId } = req.query;
    const filter = {};

    if (type && type !== 'All') filter.type = type;
    if (riskLevel && riskLevel !== 'All') filter.riskLevel = riskLevel;
    if (caseId) filter.relatedCases = caseId;

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { entityId: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    const entities = await Entity.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: entities.length, entities });
  } catch (err) {
    console.error('getEntities error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving entities' });
  }
};

// GET /api/entities/:id
exports.getEntityById = async (req, res) => {
  try {
    const { id } = req.params;
    const entity = await Entity.findOne({
      $or: [{ entityId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { name: id }],
    });

    if (!entity) {
      return res.status(404).json({ success: false, message: 'Entity not found' });
    }

    // Get relationships connected to this entity
    const relationships = await Relationship.find({
      $or: [{ sourceEntity: entity.name }, { targetEntity: entity.name }],
    });

    // Get cases connected to this entity
    const cases = await Case.find({
      $or: [{ caseId: { $in: entity.relatedCases } }, { suspectName: entity.name }],
    });

    res.json({ success: true, entity, relationships, cases });
  } catch (err) {
    console.error('getEntityById error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving entity' });
  }
};

// POST /api/entities
exports.createEntity = async (req, res) => {
  try {
    let { entityId, name, type, description, metadata, relatedCases, riskLevel, tags } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Entity name is required' });
    }

    if (!entityId || !entityId.trim()) {
      entityId = await generateNextEntityId();
    }

    const newEntity = new Entity({
      entityId: entityId.trim(),
      name: name.trim(),
      type: type || 'Person',
      description: description || '',
      metadata: metadata || {},
      relatedCases: relatedCases || [],
      riskLevel: riskLevel || 'Medium',
      tags: tags || [],
    });

    await newEntity.save();

    await Activity.create({
      user: req.user && req.user.email ? req.user.email.split('@')[0] : 'Investigator',
      action: 'Entity Created',
      entityId: newEntity.entityId,
      details: `Created entity ${newEntity.name} (${newEntity.type})`,
    });

    res.status(201).json({ success: true, entity: newEntity });
  } catch (err) {
    console.error('createEntity error:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error creating entity' });
  }
};

// PUT /api/entities/:id
exports.updateEntity = async (req, res) => {
  try {
    const { id } = req.params;
    const entity = await Entity.findOne({
      $or: [{ entityId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!entity) {
      return res.status(404).json({ success: false, message: 'Entity not found' });
    }

    Object.assign(entity, req.body);
    await entity.save();

    res.json({ success: true, entity });
  } catch (err) {
    console.error('updateEntity error:', err);
    res.status(500).json({ success: false, message: 'Server error updating entity' });
  }
};

// DELETE /api/entities/:id
exports.deleteEntity = async (req, res) => {
  try {
    const { id } = req.params;
    const entity = await Entity.findOne({
      $or: [{ entityId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!entity) {
      return res.status(404).json({ success: false, message: 'Entity not found' });
    }

    await Promise.all([
      Entity.deleteOne({ _id: entity._id }),
      Relationship.deleteMany({
        $or: [{ sourceEntity: entity.name }, { targetEntity: entity.name }],
      }),
    ]);

    res.json({ success: true, message: `Entity ${entity.name} deleted` });
  } catch (err) {
    console.error('deleteEntity error:', err);
    res.status(500).json({ success: false, message: 'Server error deleting entity' });
  }
};
