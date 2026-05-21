import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import PredictionChart from '../components/PredictionChart';
import Footer from '../components/Footer';
import { useToast } from '../context/ToastContext';

const Prediction = () => {
  const [searchParams] = useSearchParams();
  const initialTicker = searchParams.get('ticker') || 'AAPL';

  const [stocks, setStocks] = useState([]);
  const [ticker, setTicker] = useState(initialTicker);
  const [days, setDays] = useState(30);
  const [model, setModel] = useState('linear');

  const [predictionData, setPredictionData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const toast = useToast();

  // Fetch stocks list on mount
  useEffect(() => {
    const fetchStocksList = async () => {
      try {
        const res = await api.get('/stocks');
        if (res.data.success) {
          setStocks(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching stock list:', err);
      }
    };
    fetchStocksList();
  }, []);

  // Fetch prediction and historical analysis
  const runMLPrediction = async (showToast = false) => {
    setRunning(true);
    try {
      if (showToast) {
        toast.info(`Calculating ${model === 'linear' ? 'Linear Regression' : 'Holt-Linear'} forecast for ${ticker}...`);
      }
      // 1. Get predictions
      const predRes = await api.get(`/predictions/${ticker}?days=${days}&model=${model}`);
      if (predRes.data.success) {
        setPredictionData(predRes.data.analysis);
      }

      // 2. Get history for charts
      const histRes = await api.get(`/stocks/${ticker}/history?period=3M`);
      if (histRes.data.success) {
        setHistoryData(histRes.data.history);
      }
      if (showToast) {
        toast.success('ML Prediction updated successfully!');
      }
    } catch (err) {
      console.error('Error runMLPrediction:', err);
      toast.error(err.response?.data?.message || 'Failed to update prediction model');
    } finally {
      setLoading(false);
      setRunning(false);
    }
  };

  useEffect(() => {
    runMLPrediction(false);
  }, [ticker, days, model]);

  const getSignalClass = (sig) => {
    if (sig === 'BUY') return 'buy';
    if (sig === 'SELL') return 'sell';
    return 'hold';
  };

  return (
    <div className="prediction-page fade-up">
      <div className="prediction-inner">
        <div className="page-header">
          <h1>🧠 Machine Learning Price Predictor</h1>
          <p>Run mathematical linear regression trends and technical indicators directly on MongoDB stock histories.</p>
        </div>

        {/* Controls */}
        <div className="pred-controls">
          <div className="ctrl-group">
            <label htmlFor="ticker-select">Select Asset</label>
            <select 
              id="ticker-select"
              className="ctrl-select"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              disabled={running}
            >
              {stocks.map(s => (
                <option key={s.ticker} value={s.ticker}>{s.ticker} - {s.name}</option>
              ))}
            </select>
          </div>

          <div className="ctrl-group">
            <label htmlFor="model-select">Prediction Model</label>
            <select
              id="model-select"
              className="ctrl-select"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={running}
            >
              <option value="linear">Linear Regression</option>
              <option value="exponential">Holt-Linear Trend</option>
            </select>
          </div>

          <div className="ctrl-group">
            <label htmlFor="days-select">Forecast Window</label>
            <select
              id="days-select"
              className="ctrl-select"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              disabled={running}
            >
              <option value={7}>7 Days (Short-term)</option>
              <option value={15}>15 Days (Medium-term)</option>
              <option value={30}>30 Days (Standard)</option>
            </select>
          </div>

          <button 
            className="btn-predict"
            onClick={() => runMLPrediction(true)}
            disabled={running}
            style={{ minHeight: '38px' }}
          >
            {running ? 'Calculating...' : 'Run Forecast ⚡'}
          </button>
        </div>

        {loading || !predictionData ? (
          <div className="spinner-wrap"><div className="spinner"></div></div>
        ) : (
          <div className="pred-grid">
            {/* Left Chart */}
            <div className="pred-chart-card">
              <h3 className="card-title">Prediction Graph ({ticker})</h3>
              <div className="pred-chart-container">
                <PredictionChart 
                  historyData={historyData} 
                  predictions={predictionData.predictions} 
                  ticker={ticker} 
                />
              </div>
              <div className="pred-legend">
                <div className="legend-item">
                  <div className="legend-dot" style={{ backgroundColor: '#387ED1' }}></div>
                  <span>Historical Price (3M)</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot" style={{ border: '1px dashed #F97316' }}></div>
                  <span>ML Price Forecast ({days} Days)</span>
                </div>
              </div>
            </div>

            {/* Right Summary */}
            <div className="pred-results">
              {/* Prediction Card */}
              <div className="result-card">
                <div className={`trend-badge ${predictionData.trend.toLowerCase()}`}>
                  <span>✦</span> Trend: {predictionData.trend}
                </div>
                <div className="pred-price-big">
                  ${predictionData.predictions[predictionData.predictions.length - 1].predictedPrice.toFixed(2)}
                </div>
                <div className="pred-price-label">Predicted Price in {days} Days</div>

                <div className="confidence-row">
                  <div className="confidence-label">
                    <span>Confidence Score (R²)</span>
                    <span>{predictionData.confidence.toFixed(1)}%</span>
                  </div>
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill" 
                      style={{ width: `${Math.max(10, Math.min(100, predictionData.confidence))}%` }}
                    ></div>
                  </div>
                </div>

                <div className="metrics-grid">
                  <div className="metric-item">
                    <span className="metric-label">Min Forecast</span>
                    <span className="metric-value">${predictionData.predLow.toFixed(2)}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">Max Forecast</span>
                    <span className="metric-value">${predictionData.predHigh.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Technical Indicators */}
              <div className="indicators-card">
                <h3 className="card-title" style={{ marginBottom: '10px' }}>Technical Signal Engine</h3>
                
                <div className="indicator-row">
                  <div className="ind-name">SMA Cross (20 vs 50)</div>
                  <div className={`ind-signal ${getSignalClass(predictionData.signals.sma)}`}>
                    {predictionData.signals.sma}
                  </div>
                </div>

                <div className="indicator-row">
                  <div className="ind-name">RSI Momentum ({predictionData.indicators.rsiVal ? predictionData.indicators.rsiVal.toFixed(1) : 'N/A'})</div>
                  <div className={`ind-signal ${getSignalClass(predictionData.signals.rsi)}`}>
                    {predictionData.signals.rsi}
                  </div>
                </div>

                <div className="indicator-row">
                  <div className="ind-name">MACD Convergence</div>
                  <div className={`ind-signal ${getSignalClass(predictionData.signals.macd)}`}>
                    {predictionData.signals.macd}
                  </div>
                </div>

                <div style={{ marginTop: '14px', fontSize: '12px', color: 'var(--text-500)', lineHeight: '1.5' }}>
                  💡 Indicator Signals compile moving average crossings, RSI momentum bounds (below 30 = Oversold, above 70 = Overbought), and MACD signal convergence parameters.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Prediction;
