const express = require('express');
const router = express.Router();
const favouriteController = require('../controllers/favourite.controller');
const { authenticate } = require('../middleware/authenticate');

// Toàn bộ các route yêu thích đều yêu cầu đăng nhập
router.use(authenticate);

router.get('/', favouriteController.getFavourites);
router.post('/sync', favouriteController.syncFavourites);
router.post('/:craftId', favouriteController.addFavourite);
router.delete('/:craftId', favouriteController.removeFavourite);

module.exports = router;
