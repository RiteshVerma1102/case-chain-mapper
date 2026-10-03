const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const relationshipController = require('../controllers/relationshipController');

router.use(authMiddleware);

router.get('/', relationshipController.getRelationships);
router.post('/', relationshipController.createRelationship);
router.delete('/:id', relationshipController.deleteRelationship);

module.exports = router;
