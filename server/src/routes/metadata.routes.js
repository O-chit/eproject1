const express = require('express');
const router = express.Router();
const metadataController = require('../controllers/metadata.controller');

router.get('/categories', metadataController.getCategories);
router.get('/materials', metadataController.getMaterials);
router.get('/techniques', metadataController.getTechniques);

module.exports = router;
