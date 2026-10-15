const express = require('express');
const router = express.Router();
const craftController = require('../controllers/craft.controller');
const { authenticate } = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Public routes
router.get('/', craftController.getCrafts);
router.get('/:id', craftController.getCraftById);
router.get('/:id/related', craftController.getRelatedCrafts);

// Admin / Editor Management routes (SEC 6.3)
router.post('/', authenticate, authorize('editor', 'admin'), craftController.createCraft);
router.put('/:id', authenticate, authorize('editor', 'admin'), craftController.updateCraft);
router.delete('/:id', authenticate, authorize('admin'), craftController.deleteCraft);

module.exports = router;
