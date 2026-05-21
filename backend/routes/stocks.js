const express = require('express');
const router = express.Router();
const { getAllStocks, getStock, getHistory } = require('../controllers/stockController');

router.get('/',                getAllStocks);
router.get('/:ticker',         getStock);
router.get('/:ticker/history', getHistory);

module.exports = router;
