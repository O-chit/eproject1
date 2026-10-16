const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');

// GET /api/search
router.get('/', searchController.search);

module.exports = router;
