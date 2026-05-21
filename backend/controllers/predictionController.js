const Stock = require('../models/Stock');
const { runAnalysis } = require('../utils/mlEngine');

// @desc    Perform ML forecasts and technical indicators for a stock
// @route   GET /api/predictions/:ticker
// @access  Public
exports.getPrediction = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const model = req.query.model || 'linear';
    const stock = await Stock.findOne({ ticker: req.params.ticker.toUpperCase() });

    if (!stock) {
      return res.status(404).json({ success: false, message: `Stock ${req.params.ticker} not found` });
    }

    // Extract closing prices from the history array
    const prices = stock.history.map(item => item.close);

    if (prices.length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient historical data to run ML analysis. Need at least 50 periods.'
      });
    }

    // Run ML Analysis
    const analysis = runAnalysis(prices, days, model);

    // Provide dates for future predictions (skip weekends)
    const predictionsWithDates = [];
    let tempDate = new Date(stock.history[stock.history.length - 1].date);
    
    for (let i = 0; i < days; i++) {
      tempDate.setDate(tempDate.getDate() + 1);
      // Skip weekends
      while (tempDate.getDay() === 0 || tempDate.getDay() === 6) {
        tempDate.setDate(tempDate.getDate() + 1);
      }
      predictionsWithDates.push({
        date: new Date(tempDate),
        predictedPrice: analysis.predictions[i]
      });
    }

    res.status(200).json({
      success: true,
      ticker: stock.ticker,
      name: stock.name,
      analysis: {
        ...analysis,
        predictions: predictionsWithDates
      }
    });
  } catch (err) {
    next(err);
  }
};
