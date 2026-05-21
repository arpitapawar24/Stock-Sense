const Stock = require('../models/Stock');

// @desc    Get all stocks overview (latest prices & metadata)
// @route   GET /api/stocks
// @access  Public
exports.getAllStocks = async (req, res, next) => {
  try {
    const stocks = await Stock.find({});
    
    // Format list with basic data + latest day close
    const response = stocks.map(stock => {
      const history = stock.history;
      const latest = history[history.length - 1] || {};
      const prev = history[history.length - 2] || latest;
      
      const change = latest.close - prev.close;
      const pct = prev.close !== 0 ? ((change / prev.close) * 100).toFixed(2) : '0.00';

      return {
        ticker: stock.ticker,
        name: stock.name,
        exchange: stock.exchange,
        sector: stock.sector,
        currentPrice: latest.close || stock.basePrice,
        change: +change.toFixed(2),
        pctChange: +pct,
        open: latest.open,
        high: latest.high,
        low: latest.low,
        volume: latest.volume
      };
    });

    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single stock details
// @route   GET /api/stocks/:ticker
// @access  Public
exports.getStock = async (req, res, next) => {
  try {
    const stock = await Stock.findOne({ ticker: req.params.ticker.toUpperCase() });
    
    if (!stock) {
      return res.status(404).json({ success: false, message: `Stock ${req.params.ticker} not found` });
    }

    const latest = stock.history[stock.history.length - 1] || {};
    const prev = stock.history[stock.history.length - 2] || latest;
    const change = latest.close - prev.close;
    const pct = prev.close !== 0 ? ((change / prev.close) * 100).toFixed(2) : '0.00';

    // Calculate 52-week high, low, and average volume from the last 260 trading days
    const history52W = stock.history.slice(-260);
    const highs = history52W.map(day => day.high).filter(v => v !== undefined && v !== null);
    const lows = history52W.map(day => day.low).filter(v => v !== undefined && v !== null);
    const vols = history52W.map(day => day.volume).filter(v => v !== undefined && v !== null);

    const fiftyTwoWeekHigh = highs.length > 0 ? Math.max(...highs) : (latest.high || 0);
    const fiftyTwoWeekLow = lows.length > 0 ? Math.min(...lows) : (latest.low || 0);
    const averageVolume = vols.length > 0 ? Math.round(vols.reduce((a, b) => a + b, 0) / vols.length) : 0;

    res.status(200).json({
      success: true,
      data: {
        ticker: stock.ticker,
        name: stock.name,
        exchange: stock.exchange,
        sector: stock.sector,
        basePrice: stock.basePrice,
        currentPrice: latest.close,
        change: +change.toFixed(2),
        pctChange: +pct,
        latestOHLCV: latest,
        fiftyTwoWeekHigh: +fiftyTwoWeekHigh.toFixed(2),
        fiftyTwoWeekLow: +fiftyTwoWeekLow.toFixed(2),
        averageVolume
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get historical price array for a stock (with period limits)
// @route   GET /api/stocks/:ticker/history
// @access  Public
exports.getHistory = async (req, res, next) => {
  try {
    const { period } = req.query; // '1W', '1M', '3M', '6M', '1Y'
    const stock = await Stock.findOne({ ticker: req.params.ticker.toUpperCase() });

    if (!stock) {
      return res.status(404).json({ success: false, message: `Stock ${req.params.ticker} not found` });
    }

    let limit = 90; // Default 3M (about 60-90 trading days)
    if (period === '1W') limit = 5;
    if (period === '1M') limit = 22;
    if (period === '3M') limit = 65;
    if (period === '6M') limit = 130;
    if (period === '1Y') limit = 260;

    const historySlice = stock.history.slice(-limit);

    res.status(200).json({
      success: true,
      ticker: stock.ticker,
      period: period || '3M',
      count: historySlice.length,
      history: historySlice
    });
  } catch (err) {
    next(err);
  }
};
