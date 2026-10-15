const express = require('express');
const router = express.Router();
const craftController = require('../controllers/craft.controller');

router.get('/', craftController.getCrafts);
router.get('/:id', craftController.getCraftById);
router.get('/:id/related', craftController.getRelatedCrafts);

module.exports = router;
