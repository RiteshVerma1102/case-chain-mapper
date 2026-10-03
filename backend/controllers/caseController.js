const Case = require('../models/Case');
const Entity = require('../models/Entity');
const Evidence = require('../models/Evidence');
const TimelineEvent = require('../models/TimelineEvent');
const Investigation = require('../models/Investigation');
const Relationship = require('../models/Relationship');
const Activity = require('../models/Activity');

// Helper: generate next unique Case ID
const generateNextCaseId = async () => {
  const count = await Case.countDocuments();
  const year = new Date().getFullYear();
  const nextNum = (count + 1).toString().padStart(3, '0');
  return `CC-${year}-${nextNum}`;
};

// GET /api/cases
exports.getCases = async (req, res) => {
  try {
    const { search, priority, status, category, sort } = req.query;
    const filter = {};

    if (priority && priority !== 'All') filter.priority = priority;
    if (status && status !== 'All') filter.status = status;
    if (category && category !== 'All') filter.category = category;

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { caseId: { $regex: q, $options: 'i' } },
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { suspectName: { $regex: q, $options: 'i' } },
      ];
    }

    let query = Case.find(filter);

    if (sort === 'priority') {
      // High/Critical first
      query = query.sort({ priority: 1, createdAt: -1 });
    } else if (sort === 'oldest') {
      query = query.sort({ createdAt: 1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const cases = await query.exec();
    res.json({ success: true, count: cases.length, cases });
  } catch (err) {
    console.error('getCases error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving cases' });
  }
};

// GET /api/cases/:id
exports.getCaseById = async (req, res) => {
  try {
    const { id } = req.params;
    // id could be _id or caseId (e.g., CC-2026-001 or CASE-001)
    const caseDoc = await Case.findOne({
      $or: [{ caseId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!caseDoc) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    const caseId = caseDoc.caseId;

    // Load related items in parallel
    const [investigation, entities, evidence, timeline, relationships, relatedCases] = await Promise.all([
      Investigation.findOne({ caseId }),
      Entity.find({ relatedCases: caseId }),
      Evidence.find({ caseId }),
      TimelineEvent.find({ caseId }).sort({ date: 1, time: 1 }),
      Relationship.find({ caseId }),
      // Find cases sharing same suspect
      caseDoc.suspectName && caseDoc.suspectName !== 'Unknown'
        ? Case.find({ suspectName: caseDoc.suspectName, caseId: { $ne: caseId } })
        : Promise.resolve([]),
    ]);

    res.json({
      success: true,
      case: caseDoc,
      investigation: investigation || {
        investigationId: `INV-${caseId}`,
        caseId,
        title: `Investigation: ${caseDoc.title}`,
        status: 'Active',
        leadInvestigator: caseDoc.investigator || 'Senior Investigator',
        objectives: ['Establish timeline of events', 'Identify and interview primary entities', 'Catalogue digital and physical evidence'],
        findings: [],
        hypotheses: [],
        tasks: [],
        notes: [],
        activity: [],
      },
      entities,
      evidence,
      timeline,
      relationships,
      relatedCases,
    });
  } catch (err) {
    console.error('getCaseById error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving case details' });
  }
};

// POST /api/cases
exports.createCase = async (req, res) => {
  try {
    let { caseId, title, description, category, priority, status, suspectName, investigator, deadline, progress, location, tags } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Case title is required' });
    }

    if (!caseId || !caseId.trim()) {
      caseId = await generateNextCaseId();
    } else {
      // Verify uniqueness
      const existing = await Case.findOne({ caseId: caseId.trim() });
      if (existing) {
        return res.status(400).json({ success: false, message: `Case ID ${caseId} already exists` });
      }
    }

    const newCase = new Case({
      caseId: caseId.trim(),
      title: title.trim(),
      description: description || '',
      category: category || 'Investigation',
      priority: priority || 'Medium',
      status: status || 'Under Investigation',
      suspectName: suspectName || 'Unknown',
      investigator: investigator || (req.user && req.user.email ? req.user.email.split('@')[0] : 'Lead Investigator'),
      deadline: deadline || null,
      progress: progress !== undefined ? progress : 10,
      location: location || 'Metro District',
      tags: tags || [],
    });

    await newCase.save();

    // Create companion Investigation document
    const investigation = new Investigation({
      investigationId: `INV-${newCase.caseId}`,
      caseId: newCase.caseId,
      title: `Investigation: ${newCase.title}`,
      status: 'Active',
      leadInvestigator: newCase.investigator,
      objectives: [
        'Establish timeline of events',
        'Identify all connected entities and networks',
        'Collect and secure forensic evidence',
      ],
      findings: [],
      hypotheses: [
        { text: `Primary hypothesis under review regarding ${newCase.suspectName}`, status: 'Proposed', likelihood: 'Moderate' },
      ],
      tasks: [
        { title: 'Initial scene & evidence assessment', status: 'In Progress', assignedTo: newCase.investigator },
      ],
      notes: [],
      activity: [
        { action: 'Case Opened', details: `Case ${newCase.caseId} initialized`, user: newCase.investigator },
      ],
    });
    await investigation.save();

    // Auto-create suspect entity if valid name provided
    if (newCase.suspectName && newCase.suspectName !== 'Unknown') {
      let entity = await Entity.findOne({ name: newCase.suspectName });
      if (entity) {
        if (!entity.relatedCases.includes(newCase.caseId)) {
          entity.relatedCases.push(newCase.caseId);
          await entity.save();
        }
      } else {
        const entCount = await Entity.countDocuments();
        const newEntity = new Entity({
          entityId: `ENT-${(entCount + 1).toString().padStart(3, '0')}`,
          name: newCase.suspectName,
          type: 'Person',
          description: `Primary subject of interest in case ${newCase.caseId}`,
          riskLevel: newCase.priority === 'Critical' ? 'Critical' : newCase.priority === 'High' ? 'High' : 'Medium',
          relatedCases: [newCase.caseId],
        });
        await newEntity.save();
      }
    }

    // Log Activity
    const activity = new Activity({
      user: newCase.investigator,
      action: 'Case Created',
      caseId: newCase.caseId,
      details: `Created case "${newCase.title}" with priority ${newCase.priority}`,
    });
    await activity.save();

    res.status(201).json({ success: true, case: newCase });
  } catch (err) {
    console.error('createCase error:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error creating case' });
  }
};

// PUT /api/cases/:id
exports.updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const caseDoc = await Case.findOne({
      $or: [{ caseId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!caseDoc) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    Object.assign(caseDoc, updates);
    await caseDoc.save();

    // Log Activity
    const activity = new Activity({
      user: req.user && req.user.email ? req.user.email.split('@')[0] : 'Investigator',
      action: 'Case Updated',
      caseId: caseDoc.caseId,
      details: `Updated details for ${caseDoc.caseId}`,
    });
    await activity.save();

    res.json({ success: true, case: caseDoc });
  } catch (err) {
    console.error('updateCase error:', err);
    res.status(500).json({ success: false, message: 'Server error updating case' });
  }
};

// DELETE /api/cases/:id
exports.deleteCase = async (req, res) => {
  try {
    const { id } = req.params;
    const caseDoc = await Case.findOne({
      $or: [{ caseId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!caseDoc) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    const caseId = caseDoc.caseId;

    await Promise.all([
      Case.deleteOne({ _id: caseDoc._id }),
      Investigation.deleteMany({ caseId }),
      Evidence.deleteMany({ caseId }),
      TimelineEvent.deleteMany({ caseId }),
      Relationship.deleteMany({ caseId }),
      Activity.create({
        user: req.user && req.user.email ? req.user.email.split('@')[0] : 'Investigator',
        action: 'Case Deleted',
        caseId,
        details: `Deleted case ${caseId}`,
      }),
    ]);

    res.json({ success: true, message: `Case ${caseId} deleted successfully` });
  } catch (err) {
    console.error('deleteCase error:', err);
    res.status(500).json({ success: false, message: 'Server error deleting case' });
  }
};

// GET /api/cases/:id/related
exports.getRelatedCases = async (req, res) => {
  try {
    const { id } = req.params;
    const target = await Case.findOne({
      $or: [{ caseId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!target) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    const related = await Case.find({
      caseId: { $ne: target.caseId },
      $or: [
        { suspectName: target.suspectName },
        { category: target.category },
        { priority: target.priority },
      ],
    }).limit(10);

    res.json({ success: true, related });
  } catch (err) {
    console.error('getRelatedCases error:', err);
    res.status(500).json({ success: false, message: 'Server error finding related cases' });
  }
};
