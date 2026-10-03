const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const timelineController = require('../controllers/timelineController');

router.use(authMiddleware);

router.get('/', timelineController.getTimelineEvents);
router.post('/', timelineController.createTimelineEvent);
router.delete('/:id', timelineController.deleteTimelineEvent);

module.exports = router;
