const express = require('express');
const router = express.Router();
const artisanController = require('../controllers/artisan.controller');

router.get('/', artisanController.getArtisans);
router.get('/:id', artisanController.getArtisanById);

module.exports = router;
