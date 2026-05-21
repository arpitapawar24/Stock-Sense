const express = require('express');
const router = express.Router();
const { getWatchlist, addToWatchlist, removeFromWatchlist } = require('../controllers/watchlistController');
const { protect } = require('../middleware/auth');

router.use(protect); // Secure all watchlist actions

router.route('/')
  .get(getWatchlist)
  .post(addToWatchlist);

router.route('/:ticker')
  .delete(removeFromWatchlist);

module.exports = router;
