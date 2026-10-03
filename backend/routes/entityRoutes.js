const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const entityController = require('../controllers/entityController');

router.use(authMiddleware);

router.get('/', entityController.getEntities);
router.post('/', entityController.createEntity);
router.get('/:id', entityController.getEntityById);
router.put('/:id', entityController.updateEntity);
router.delete('/:id', entityController.deleteEntity);

module.exports = router;
