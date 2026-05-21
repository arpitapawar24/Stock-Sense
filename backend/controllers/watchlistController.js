const Watchlist = require('../models/Watchlist');
const Stock = require('../models/Stock');

// @desc    Get user's watchlist items
// @route   GET /api/watchlist
// @access  Private
exports.getWatchlist = async (req, res, next) => {
  try {
    let watchlist = await Watchlist.findOne({ user: req.user.id });

    if (!watchlist) {
      watchlist = await Watchlist.create({ user: req.user.id, tickers: ['AAPL', 'MSFT', 'TSLA'] });
    }

    // Populate with stock details
    const stocks = await Stock.find({ ticker: { $in: watchlist.tickers } });
    
    // Sort to match watchlist order
    const formatted = watchlist.tickers.map(ticker => {
      const stock = stocks.find(s => s.ticker === ticker);
      if (!stock) return null;
      
      const latest = stock.history[stock.history.length - 1] || {};
      const prev = stock.history[stock.history.length - 2] || latest;
      const change = latest.close - prev.close;
      const pct = prev.close !== 0 ? ((change / prev.close) * 100).toFixed(2) : '0.00';

      return {
        ticker: stock.ticker,
        name: stock.name,
        exchange: stock.exchange,
        currentPrice: latest.close || stock.basePrice,
        change: +change.toFixed(2),
        pctChange: +pct
      };
    }).filter(Boolean);

    res.status(200).json({ success: true, data: formatted, rawTickers: watchlist.tickers });
  } catch (err) {
    next(err);
  }
};

// @desc    Add a stock to user's watchlist
// @route   POST /api/watchlist
// @access  Private
exports.addToWatchlist = async (req, res, next) => {
  try {
    const { ticker } = req.body;
    if (!ticker) {
      return res.status(400).json({ success: false, message: 'Please provide stock ticker' });
    }

    const uppercaseTicker = ticker.toUpperCase();

    // Verify stock exists in DB
    const stockExists = await Stock.findOne({ ticker: uppercaseTicker });
    if (!stockExists) {
      return res.status(404).json({ success: false, message: `Stock ${uppercaseTicker} does not exist` });
    }

    let watchlist = await Watchlist.findOne({ user: req.user.id });
    if (!watchlist) {
      watchlist = new Watchlist({ user: req.user.id, tickers: [] });
    }

    if (watchlist.tickers.includes(uppercaseTicker)) {
      return res.status(400).json({ success: false, message: 'Stock already in watchlist' });
    }

    watchlist.tickers.push(uppercaseTicker);
    await watchlist.save();

    res.status(200).json({ success: true, message: `Added ${uppercaseTicker} to watchlist`, data: watchlist.tickers });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove a stock from user's watchlist
// @route   DELETE /api/watchlist/:ticker
// @access  Private
exports.removeFromWatchlist = async (req, res, next) => {
  try {
    const uppercaseTicker = req.params.ticker.toUpperCase();
    const watchlist = await Watchlist.findOne({ user: req.user.id });

    if (!watchlist || !watchlist.tickers.includes(uppercaseTicker)) {
      return res.status(404).json({ success: false, message: 'Stock not in watchlist' });
    }

    watchlist.tickers = watchlist.tickers.filter(t => t !== uppercaseTicker);
    await watchlist.save();

    res.status(200).json({ success: true, message: `Removed ${uppercaseTicker} from watchlist`, data: watchlist.tickers });
  } catch (err) {
    next(err);
  }
};
