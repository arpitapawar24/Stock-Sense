const express = require('express');
const router = express.Router();
const { getPrediction } = require('../controllers/predictionController');

router.get('/:ticker', getPrediction);

module.exports = router;
