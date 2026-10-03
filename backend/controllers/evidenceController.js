const Evidence = require('../models/Evidence');
const Activity = require('../models/Activity');

const generateNextEvidenceId = async () => {
  const count = await Evidence.countDocuments();
  return `EVD-${(count + 1).toString().padStart(3, '0')}`;
};

exports.getEvidence = async (req, res) => {
  try {
    const { caseId, type, status, search } = req.query;
    const filter = {};

    if (caseId) filter.caseId = caseId;
    if (type && type !== 'All') filter.type = type;
    if (status && status !== 'All') filter.status = status;

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { evidenceId: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }

    const evidence = await Evidence.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: evidence.length, evidence });
  } catch (err) {
    console.error('getEvidence error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving evidence' });
  }
};

exports.createEvidence = async (req, res) => {
  try {
    let { evidenceId, name, type, description, caseId, uploadedBy, status, relatedEntities, relatedTimelineEvents } = req.body;

    if (!name || !caseId) {
      return res.status(400).json({ success: false, message: 'Evidence name and case ID are required' });
    }

    if (!evidenceId || !evidenceId.trim()) {
      evidenceId = await generateNextEvidenceId();
    }

    const author = uploadedBy || (req.user && req.user.email ? req.user.email.split('@')[0] : 'Evidence Specialist');

    const newEvidence = new Evidence({
      evidenceId: evidenceId.trim(),
      name: name.trim(),
      type: type || 'Digital Record',
      description: description || '',
      caseId: caseId.trim(),
      uploadedBy: author,
      status: status || 'Collected',
      chainOfCustody: [{ handler: author, action: 'Initial Intake & Tagging', location: 'Evidence Locker 3' }],
      relatedEntities: relatedEntities || [],
      relatedTimelineEvents: relatedTimelineEvents || [],
    });

    await newEvidence.save();

    await Activity.create({
      user: author,
      action: 'Evidence Logged',
      caseId,
      details: `Logged evidence "${newEvidence.name}" (${newEvidence.type}) for ${caseId}`,
    });

    res.status(201).json({ success: true, evidence: newEvidence });
  } catch (err) {
    console.error('createEvidence error:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error creating evidence' });
  }
};

exports.updateEvidence = async (req, res) => {
  try {
    const { id } = req.params;
    const ev = await Evidence.findOne({
      $or: [{ evidenceId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!ev) {
      return res.status(404).json({ success: false, message: 'Evidence not found' });
    }

    Object.assign(ev, req.body);
    await ev.save();

    res.json({ success: true, evidence: ev });
  } catch (err) {
    console.error('updateEvidence error:', err);
    res.status(500).json({ success: false, message: 'Server error updating evidence' });
  }
};

exports.deleteEvidence = async (req, res) => {
  try {
    const { id } = req.params;
    const ev = await Evidence.findOne({
      $or: [{ evidenceId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!ev) {
      return res.status(404).json({ success: false, message: 'Evidence not found' });
    }

    await Evidence.deleteOne({ _id: ev._id });
    res.json({ success: true, message: 'Evidence deleted' });
  } catch (err) {
    console.error('deleteEvidence error:', err);
    res.status(500).json({ success: false, message: 'Server error deleting evidence' });
  }
};
