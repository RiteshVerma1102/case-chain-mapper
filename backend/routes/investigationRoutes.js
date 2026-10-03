const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const investigationController = require('../controllers/investigationController');

router.use(authMiddleware);

router.get('/', investigationController.getInvestigations);
router.get('/:caseId', investigationController.getInvestigationByCaseId);
router.put('/:id', investigationController.updateInvestigation);
router.post('/:id/findings', investigationController.addFinding);

module.exports = router;
