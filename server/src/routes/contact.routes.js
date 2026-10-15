const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { authenticate } = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Public route
router.post('/', contactController.submitContact);

// Admin / Editor Management routes (SEC 6.3)
router.get('/messages', authenticate, authorize('editor', 'admin'), contactController.getContactMessages);
router.patch('/messages/:id/status', authenticate, authorize('editor', 'admin'), contactController.updateContactMessageStatus);

module.exports = router;
