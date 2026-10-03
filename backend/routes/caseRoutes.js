const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const caseController = require('../controllers/caseController');

// All case routes require authentication
router.use(authMiddleware);

router.get('/', caseController.getCases);
router.post('/', caseController.createCase);
router.get('/:id', caseController.getCaseById);
router.put('/:id', caseController.updateCase);
router.delete('/:id', caseController.deleteCase);
router.get('/:id/related', caseController.getRelatedCases);

module.exports = router;
