const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller');

// GET /api/home
router.get('/', homeController.getHome);

// GET /api/stats
router.get('/stats', homeController.getStats);

module.exports = router;
