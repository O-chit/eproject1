const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collection.controller');
const { authenticate } = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Public routes
router.get('/', collectionController.getSeasonalCollections);
router.get('/latest', collectionController.getSeasonalCollectionLatest);
router.get('/:id', collectionController.getSeasonalCollectionById);

// Admin / Editor Management routes (SEC 6.3)
router.post('/', authenticate, authorize('editor', 'admin'), collectionController.createSeasonalCollection);
router.put('/:id', authenticate, authorize('editor', 'admin'), collectionController.updateSeasonalCollection);
router.delete('/:id', authenticate, authorize('admin'), collectionController.deleteSeasonalCollection);

module.exports = router;
