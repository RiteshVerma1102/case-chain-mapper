const express = require('express');
const router = express.Router();
const seedController = require('../controllers/seedController');

// Seeding endpoint (can be triggered without auth or with auth for easy demo resets)
router.post('/', seedController.seedDatabase);
router.get('/', seedController.seedDatabase);

module.exports = router;
