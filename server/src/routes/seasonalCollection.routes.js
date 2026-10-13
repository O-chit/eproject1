const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collection.controller');

// GET /api/seasonal-collections
router.get('/', collectionController.getSeasonalCollections);

// GET /api/seasonal-collections/:id
router.get('/:id', collectionController.getSeasonalCollectionById);

module.exports = router;
