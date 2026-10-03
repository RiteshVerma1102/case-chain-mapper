const Alert = require('../models/Alert');

exports.getAlerts = async (req, res) => {
  try {
    const { unreadOnly, type } = req.query;
    const filter = {};

    if (unreadOnly === 'true') filter.isRead = false;
    if (type && type !== 'All') filter.type = type;

    const alerts = await Alert.find(filter).sort({ createdAt: -1 });
    const unreadCount = await Alert.countDocuments({ isRead: false });

    res.json({ success: true, count: alerts.length, unreadCount, alerts });
  } catch (err) {
    console.error('getAlerts error:', err);
    res.status(500).json({ success: false, message: 'Server error retrieving alerts' });
  }
};

exports.markAlertRead = async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await Alert.findOne({
      $or: [{ alertId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    alert.isRead = true;
    await alert.save();

    res.json({ success: true, alert });
  } catch (err) {
    console.error('markAlertRead error:', err);
    res.status(500).json({ success: false, message: 'Server error updating alert' });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await Alert.updateMany({ isRead: false }, { $set: { isRead: true } });
    res.json({ success: true, message: 'All alerts marked as read' });
  } catch (err) {
    console.error('markAllRead error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createAlert = async (req, res) => {
  try {
    const { title, message, type, caseId, relatedCases, category } = req.body;
    const count = await Alert.countDocuments();
    const alertId = `ALT-${(count + 1).toString().padStart(3, '0')}`;

    const newAlert = new Alert({
      alertId,
      title,
      message,
      type: type || 'info',
      caseId: caseId || '',
      relatedCases: relatedCases || [],
      category: category || 'General',
    });

    await newAlert.save();
    res.status(201).json({ success: true, alert: newAlert });
  } catch (err) {
    console.error('createAlert error:', err);
    res.status(500).json({ success: false, message: 'Server error creating alert' });
  }
};
