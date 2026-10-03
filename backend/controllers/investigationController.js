const Investigation = require('../models/Investigation');
const Case = require('../models/Case');
const Activity = require('../models/Activity');

exports.getInvestigations = async (req, res) => {
  try {
    const { status, caseId } = req.query;
    const filter = {};
    if (status && status !== 'All') filter.status = status;
    if (caseId) filter.caseId = caseId;

    const investigations = await Investigation.find(filter).sort({ updatedAt: -1 });
    res.json({ success: true, count: investigations.length, investigations });
  } catch (err) {
    console.error('getInvestigations error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving investigations' });
  }
};

exports.getInvestigationByCaseId = async (req, res) => {
  try {
    const { caseId } = req.params;
    let inv = await Investigation.findOne({ caseId });

    if (!inv) {
      // Find case to initialize
      const caseDoc = await Case.findOne({ caseId });
      if (!caseDoc) {
        return res.status(404).json({ success: false, message: 'Case not found' });
      }
      inv = new Investigation({
        investigationId: `INV-${caseId}`,
        caseId,
        title: `Investigation: ${caseDoc.title}`,
        status: 'Active',
        leadInvestigator: caseDoc.investigator || 'Senior Investigator',
        objectives: ['Establish timeline of events', 'Identify primary suspect connections', 'Catalogue forensic records'],
      });
      await inv.save();
    }

    res.json({ success: true, investigation: inv });
  } catch (err) {
    console.error('getInvestigationByCaseId error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving investigation' });
  }
};

exports.updateInvestigation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const inv = await Investigation.findOne({
      $or: [{ investigationId: id }, { caseId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!inv) {
      return res.status(404).json({ success: false, message: 'Investigation not found' });
    }

    Object.assign(inv, updates);
    await inv.save();

    await Activity.create({
      user: req.user && req.user.email ? req.user.email.split('@')[0] : 'Investigator',
      action: 'Investigation Updated',
      caseId: inv.caseId,
      details: `Updated investigation logs for ${inv.caseId}`,
    });

    res.json({ success: true, investigation: inv });
  } catch (err) {
    console.error('updateInvestigation error:', err);
    res.status(500).json({ success: false, message: 'Server error updating investigation' });
  }
};

// Add finding to investigation
exports.addFinding = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, confidence } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Finding text required' });
    }

    const inv = await Investigation.findOne({
      $or: [{ investigationId: id }, { caseId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!inv) {
      return res.status(404).json({ success: false, message: 'Investigation not found' });
    }

    const author = req.user && req.user.email ? req.user.email.split('@')[0] : 'Investigator';
    inv.findings.push({
      text,
      confidence: confidence || 'High',
      author,
      timestamp: new Date(),
    });

    inv.activity.push({
      action: 'Finding Logged',
      details: text.slice(0, 80),
      user: author,
      timestamp: new Date(),
    });

    await inv.save();

    res.json({ success: true, investigation: inv });
  } catch (err) {
    console.error('addFinding error:', err);
    res.status(500).json({ success: false, message: 'Server error adding finding' });
  }
};
