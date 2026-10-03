const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const alertController = require('../controllers/alertController');

router.use(authMiddleware);

router.get('/', alertController.getAlerts);
router.post('/', alertController.createAlert);
router.put('/mark-all-read', alertController.markAllRead);
router.put('/:id/read', alertController.markAlertRead);

module.exports = router;
