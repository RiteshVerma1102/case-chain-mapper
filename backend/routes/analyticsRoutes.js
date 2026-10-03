const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const analyticsController = require('../controllers/analyticsController');

router.use(authMiddleware);

router.get('/', analyticsController.getAnalytics);

module.exports = router;
