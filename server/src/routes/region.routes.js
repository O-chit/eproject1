const express = require('express');
const router = express.Router();
const regionController = require('../controllers/region.controller');

router.get('/', regionController.getRegions);
router.get('/:id/crafts', regionController.getCraftsByRegion);

module.exports = router;
