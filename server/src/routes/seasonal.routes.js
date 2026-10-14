const express = require('express');
const seasonalController = require('../controllers/seasonal.controller');

const router = express.Router();

router.get('/', seasonalController.listSeasonalCollections);
router.get('/:id', seasonalController.getSeasonalCollectionDetail);

module.exports = router;
