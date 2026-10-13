const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collection.controller');

// GET /api/collections
router.get('/', collectionController.getCollections);

module.exports = router;
