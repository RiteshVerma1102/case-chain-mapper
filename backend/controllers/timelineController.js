const TimelineEvent = require('../models/TimelineEvent');
const Activity = require('../models/Activity');

const generateNextEventId = async () => {
  const count = await TimelineEvent.countDocuments();
  return `EVT-${(count + 1).toString().padStart(3, '0')}`;
};

exports.getTimelineEvents = async (req, res) => {
  try {
    const { caseId, eventType, entity, sort } = req.query;
    const filter = {};

    if (caseId) filter.caseId = caseId;
    if (eventType && eventType !== 'All') filter.eventType = eventType;
    if (entity) filter.relatedEntity = entity;

    const sortOrder = sort === 'desc' ? -1 : 1;
    const events = await TimelineEvent.find(filter).sort({ date: sortOrder, time: sortOrder });

    res.json({ success: true, count: events.length, events });
  } catch (err) {
    console.error('getTimelineEvents error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving timeline' });
  }
};

exports.createTimelineEvent = async (req, res) => {
  try {
    let { eventId, caseId, date, time, eventType, description, relatedEntity, relatedEvidence, location, createdBy } = req.body;

    if (!caseId || !description) {
      return res.status(400).json({ success: false, message: 'Case ID and description are required' });
    }

    if (!eventId || !eventId.trim()) {
      eventId = await generateNextEventId();
    }

    const author = createdBy || (req.user && req.user.email ? req.user.email.split('@')[0] : 'Investigator');

    const newEvent = new TimelineEvent({
      eventId: eventId.trim(),
      caseId: caseId.trim(),
      date: date ? new Date(date) : new Date(),
      time: time || '12:00 PM',
      eventType: eventType || 'Incident',
      description: description.trim(),
      relatedEntity: relatedEntity || '',
      relatedEvidence: relatedEvidence || '',
      location: location || '',
      createdBy: author,
    });

    await newEvent.save();

    await Activity.create({
      user: author,
      action: 'Timeline Event Added',
      caseId,
      details: `${newEvent.eventType}: ${newEvent.description.slice(0, 60)}`,
    });

    res.status(201).json({ success: true, event: newEvent });
  } catch (err) {
    console.error('createTimelineEvent error:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error creating timeline event' });
  }
};

exports.deleteTimelineEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const evt = await TimelineEvent.findOne({
      $or: [{ eventId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!evt) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    await TimelineEvent.deleteOne({ _id: evt._id });
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    console.error('deleteTimelineEvent error:', err);
    res.status(500).json({ success: false, message: 'Server error deleting event' });
  }
};
