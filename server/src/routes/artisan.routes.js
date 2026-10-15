const express = require('express');
const router = express.Router();
const artisanController = require('../controllers/artisan.controller');
const { authenticate } = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Public routes
router.get('/', artisanController.getArtisans);
router.get('/:id', artisanController.getArtisanById);

// Admin / Editor Management routes (SEC 6.3)
router.post('/', authenticate, authorize('editor', 'admin'), artisanController.createArtisan);
router.put('/:id', authenticate, authorize('editor', 'admin'), artisanController.updateArtisan);
router.delete('/:id', authenticate, authorize('admin'), artisanController.deleteArtisan);

module.exports = router;
