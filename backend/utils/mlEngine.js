// ── ML Engine — StockSense Backend ──────────────────────────────────────────
// All ML algorithms implemented from scratch in Node.js

// Linear Regression
function linearRegression(data) {
  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i; sumY += data[i];
    sumXY += i * data[i]; sumX2 += i * i;
  }
  const denom = n * sumX2 - sumX * sumX;
  const slope = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0;
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

function predictPrices(prices, daysAhead) {
  const { slope, intercept } = linearRegression(prices);
  const lastIdx = prices.length - 1;
  return Array.from({ length: daysAhead }, (_, i) =>
    +Math.max(intercept + slope * (lastIdx + i + 1), 1).toFixed(2)
  );
}

// Double Exponential Smoothing (Holt-Linear)
function predictPricesHoltLinear(prices, daysAhead, alpha = 0.2, beta = 0.2) {
  const n = prices.length;
  if (n === 0) return Array.from({ length: daysAhead }, () => 0);
  if (n === 1) return Array.from({ length: daysAhead }, () => prices[0]);

  let level = prices[0];
  let trend = prices[1] - prices[0];

  for (let i = 1; i < n; i++) {
    const lastLevel = level;
    level = alpha * prices[i] + (1 - alpha) * (level + trend);
    trend = beta * (level - lastLevel) + (1 - beta) * trend;
  }

  const predictions = [];
  for (let h = 1; h <= daysAhead; h++) {
    const predVal = level + h * trend;
    predictions.push(+Math.max(predVal, 1).toFixed(2));
  }
  return predictions;
}

// Simple Moving Average
function sma(data, period) {
  if (data.length < period) return null;
  const slice = data.slice(-period);
  return +(slice.reduce((a, b) => a + b, 0) / period).toFixed(2);
}

// Exponential Moving Average
function ema(data, period) {
  if (data.length < period) return null;
  const k = 2 / (period + 1);
  let val = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < data.length; i++) {
    val = data[i] * k + val * (1 - k);
  }
  return +val.toFixed(2);
}

// RSI (14-period)
function rsi(data, period = 14) {
  if (data.length < period + 1) return null;
  const changes = data.slice(1).map((v, i) => v - data[i]);
  const recent = changes.slice(-period);
  const gains = recent.filter(c => c > 0).reduce((a, b) => a + b, 0) / period;
  const losses = Math.abs(recent.filter(c => c < 0).reduce((a, b) => a + b, 0)) / period;
  if (losses === 0) return 100;
  return +(100 - 100 / (1 + gains / losses)).toFixed(1);
}

// R-squared (model confidence)
function rSquared(data) {
  const { slope, intercept } = linearRegression(data);
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  let ssTot = 0, ssRes = 0;
  data.forEach((v, i) => {
    ssTot += Math.pow(v - mean, 2);
    ssRes += Math.pow(v - (intercept + slope * i), 2);
  });
  return ssTot === 0 ? 1 : Math.max(0, Math.min(1, 1 - ssRes / ssTot));
}

// Full Analysis
function runAnalysis(prices, daysAhead = 30, model = 'linear') {
  const current = prices[prices.length - 1];
  const predictions = model === 'exponential'
    ? predictPricesHoltLinear(prices, daysAhead)
    : predictPrices(prices, daysAhead);
  const predicted = predictions[predictions.length - 1];
  const pctChange = ((predicted - current) / current) * 100;

  const sma20 = sma(prices, 20);
  const sma50 = sma(prices, 50);
  const ema20 = ema(prices, 20);
  const ema26 = ema(prices, 26);
  const rsiVal = rsi(prices, 14);
  const r2 = rSquared(prices);
  const confidence = +(50 + r2 * 42).toFixed(1);
  const macd = ema20 && ema26 ? +(ema20 - ema26).toFixed(2) : null;

  const trend = pctChange > 1.5 ? 'bullish' : pctChange < -1.5 ? 'bearish' : 'neutral';

  const signals = {
    sma:  sma20 && sma50 ? (sma20 > sma50 ? 'BUY' : 'SELL') : 'HOLD',
    rsi:  rsiVal ? (rsiVal < 30 ? 'BUY' : rsiVal > 70 ? 'SELL' : 'HOLD') : 'HOLD',
    macd: macd ? (macd > 0 ? 'BUY' : 'SELL') : 'HOLD',
    trend: trend === 'bullish' ? 'BUY' : trend === 'bearish' ? 'SELL' : 'HOLD',
  };

  return {
    currentPrice: current,
    predictedPrice: predicted,
    predLow: +(predicted * 0.97).toFixed(2),
    predHigh: +(predicted * 1.03).toFixed(2),
    pctChange: +pctChange.toFixed(2),
    trend,
    confidence,
    r2: +(r2 * 100).toFixed(1),
    daysAhead,
    indicators: { sma20, sma50, ema20, rsiVal, macd },
    signals,
    predictions,
  };
}

module.exports = { linearRegression, predictPrices, predictPricesHoltLinear, sma, ema, rsi, rSquared, runAnalysis };
