const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const craftRoutes = require('./craft.routes');
const artisanRoutes = require('./artisan.routes');
const regionRoutes = require('./region.routes');
const metadataRoutes = require('./metadata.routes');
const collectionRoutes = require('./collection.routes');
const seasonalCollectionRoutes = require('./seasonalCollection.routes');
const galleryRoutes = require('./gallery.routes');
const favouriteRoutes = require('./favourite.routes');
const contactRoutes = require('./contact.routes');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    database: 'connected',
    timestamp: new Date().toISOString(),
  });
});

// Gắn các phân hệ routes theo OpenAPI 3.0.3 Contract
router.use('/auth', authRoutes);
router.use('/crafts', craftRoutes);
router.use('/artisans', artisanRoutes);
router.use('/regions', regionRoutes);
router.use('/', metadataRoutes); // /categories, /materials, /techniques
router.use('/collections', collectionRoutes);
router.use('/seasonal-collections', seasonalCollectionRoutes);
router.use('/gallery', galleryRoutes);
router.use('/favourites', favouriteRoutes);
router.use('/contact', contactRoutes);

module.exports = router;
