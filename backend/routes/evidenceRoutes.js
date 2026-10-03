const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const evidenceController = require('../controllers/evidenceController');

router.use(authMiddleware);

router.get('/', evidenceController.getEvidence);
router.post('/', evidenceController.createEvidence);
router.put('/:id', evidenceController.updateEvidence);
router.delete('/:id', evidenceController.deleteEvidence);

module.exports = router;
