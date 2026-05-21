import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import StockChart from '../components/StockChart';
import { Search } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [currentTicker, setCurrentTicker] = useState('AAPL');
  const [currentStock, setCurrentStock] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [period, setPeriod] = useState('3M');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarTab, setSidebarTab] = useState('all');
  
  const [loadingStocks, setLoadingStocks] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);
  const toast = useToast();

  // Fetch all stocks metadata
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await api.get('/stocks');
        if (res.data.success) {
          setStocks(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching stocks:', err);
      } finally {
        setLoadingStocks(false);
      }
    };
    fetchStocks();
  }, []);

  // Fetch watchlist
  const fetchWatchlist = async () => {
    setLoadingWatchlist(true);
    try {
      const res = await api.get('/watchlist');
      if (res.data.success) {
        setWatchlist(res.data.rawTickers || []);
      }
    } catch (err) {
      console.error('Error fetching watchlist:', err);
    } finally {
      setLoadingWatchlist(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  // Load single stock & history on ticker or period change
  useEffect(() => {
    const loadStockDetails = async () => {
      setLoadingHistory(true);
      try {
        // Stock Metadata
        const stockRes = await api.get(`/stocks/${currentTicker}`);
        if (stockRes.data.success) {
          setCurrentStock(stockRes.data.data);
        }

        // History
        const histRes = await api.get(`/stocks/${currentTicker}/history?period=${period}`);
        if (histRes.data.success) {
          setHistoryData(histRes.data.history);
        }
      } catch (err) {
        console.error('Error loading stock info:', err);
      } finally {
        setLoadingHistory(false);
      }
    };
    loadStockDetails();
  }, [currentTicker, period]);

  // Toggle stock in watchlist
  const handleWatchlistToggle = async (ticker, e) => {
    e.stopPropagation(); // Stop click bubbling to card selection
    const isAdded = watchlist.includes(ticker);
    try {
      if (isAdded) {
        await api.delete(`/watchlist/${ticker}`);
        setWatchlist(watchlist.filter(t => t !== ticker));
        toast.success(`Removed ${ticker} from Watchlist`);
      } else {
        await api.post('/watchlist', { ticker });
        setWatchlist([...watchlist, ticker]);
        toast.success(`Added ${ticker} to Watchlist`);
      }
    } catch (err) {
      console.error('Error modifying watchlist:', err);
      toast.error('Failed to update watchlist');
    }
  };

  // Helper formatting methods
  const formatPrice = (p) => (p ? `$${p.toFixed(2)}` : '—');
  const formatVolume = (v) => {
    if (!v) return '—';
    if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
    if (v >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
    return v.toString();
  };
  const formatDate = (dStr) => {
    const d = new Date(dStr);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Filter stocks based on sidebar tab & search query
  const filteredStocks = stocks.filter(stock => {
    if (sidebarTab === 'watchlist' && !watchlist.includes(stock.ticker)) {
      return false;
    }
    return (
      stock.ticker.includes(searchQuery.toUpperCase()) || 
      stock.name.toUpperCase().includes(searchQuery.toUpperCase())
    );
  });

  return (
    <div className="dashboard-page fade-up">
      {/* Top Search Bar */}
      <div className="dashboard-topbar">
        <div className="search-box">
          <Search size={15} style={{ color: 'var(--text-500)' }} />
          <input 
            type="text" 
            placeholder="Search stocks… (e.g. AAPL, TSLA)" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="topbar-info">
          <span className="topbar-dot"></span>Market Data · Seeded MongoDB Atlas
        </div>
        <Link 
          to={`/prediction?ticker=${currentTicker}`} 
          className="btn-primary" 
          style={{ fontSize: '13px', padding: '7px 16px' }}
        >
          Run Prediction →
        </Link>
      </div>

      <div className="dashboard-body">
        {/* Sidebar Watchlist */}
        <div className="dashboard-sidebar">
          <div className="sidebar-header">Stocks list</div>
          <div className="sidebar-tabs">
            <button 
              className={`sidebar-tab-btn ${sidebarTab === 'all' ? 'active' : ''}`}
              onClick={() => setSidebarTab('all')}
            >
              All Stocks
            </button>
            <button 
              className={`sidebar-tab-btn ${sidebarTab === 'watchlist' ? 'active' : ''}`}
              onClick={() => setSidebarTab('watchlist')}
            >
              Watchlist
            </button>
          </div>
          {loadingStocks ? (
            <div className="spinner-wrap" style={{ height: '100px' }}><div className="spinner"></div></div>
          ) : (
            <div>
              {filteredStocks.map(stock => {
                const isWatchlisted = watchlist.includes(stock.ticker);
                const isUp = stock.change >= 0;
                
                return (
                  <div 
                    key={stock.ticker}
                    className={`sidebar-item ${stock.ticker === currentTicker ? 'active' : ''}`}
                    onClick={() => setCurrentTicker(stock.ticker)}
                  >
                    <div>
                      <div className="si-sym" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {stock.ticker}
                        <button 
                          onClick={(e) => handleWatchlistToggle(stock.ticker, e)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: isWatchlisted ? '#EAB308' : '#D1D5DB',
                            outline: 'none'
                          }}
                          title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        >
                          ★
                        </button>
                      </div>
                      <div className="si-name">{stock.name}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="si-price">{formatPrice(stock.currentPrice)}</span>
                      <span className={`si-change ${isUp ? 'up' : 'down'}`}>
                        {isUp ? '+' : ''}{stock.pctChange}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          {loadingHistory || !currentStock ? (
            <div className="spinner-wrap"><div className="spinner"></div></div>
          ) : (
            <>
              {/* Stock Header */}
              <div className="stock-header-card">
                <div className="sh-left">
                  <div className="sh-name">
                    <span>{currentStock.ticker}</span>
                    <span className="sh-exch">{currentStock.exchange}</span>
                  </div>
                  <div className="sh-fullname">{currentStock.name}</div>
                </div>
                <div className="sh-right">
                  <div className="sh-price">{formatPrice(currentStock.currentPrice)}</div>
                  <div className="sh-change-row">
                    <span className={`sh-badge ${currentStock.change >= 0 ? 'up' : 'down'}`}>
                      {currentStock.change >= 0 ? '+' : ''}${currentStock.change.toFixed(2)}
                    </span>
                    <span className={`sh-badge ${currentStock.change >= 0 ? 'up' : 'down'}`}>
                      {currentStock.change >= 0 ? '+' : ''}{currentStock.pctChange}%
                    </span>
                    <span className="sh-time">Today</span>
                  </div>
                </div>
              </div>

              {/* Chart Card */}
              <div className="chart-card">
                <div className="card-top">
                  <div className="card-title">Price Chart ({currentTicker})</div>
                  <div className="chart-period-btns">
                    {['1W', '1M', '3M', '6M', '1Y'].map(p => (
                      <button 
                        key={p}
                        className={`period-btn ${p === period ? 'active' : ''}`}
                        onClick={() => setPeriod(p)}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="chart-container">
                  <StockChart historyData={historyData} ticker={currentTicker} />
                </div>
              </div>

              {/* OHLCV Card */}
              <div className="ohlcv-card">
                <div className="card-title">Market Metrics & OHLCV</div>
                <div className="ohlcv-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
                  <div className="ohlcv-item">
                    <div className="ohlcv-label">Open</div>
                    <div className="ohlcv-val">{formatPrice(currentStock.latestOHLCV.open)}</div>
                  </div>
                  <div className="ohlcv-item">
                    <div className="ohlcv-label">High</div>
                    <div className="ohlcv-val" style={{ color: 'var(--green)' }}>{formatPrice(currentStock.latestOHLCV.high)}</div>
                  </div>
                  <div className="ohlcv-item">
                    <div className="ohlcv-label">Low</div>
                    <div className="ohlcv-val" style={{ color: 'var(--red)' }}>{formatPrice(currentStock.latestOHLCV.low)}</div>
                  </div>
                  <div className="ohlcv-item">
                    <div className="ohlcv-label">Close</div>
                    <div className="ohlcv-val">{formatPrice(currentStock.latestOHLCV.close)}</div>
                  </div>
                  <div className="ohlcv-item">
                    <div className="ohlcv-label">Volume</div>
                    <div className="ohlcv-val">{formatVolume(currentStock.latestOHLCV.volume)}</div>
                  </div>
                  <div className="ohlcv-item">
                    <div className="ohlcv-label">Avg Volume</div>
                    <div className="ohlcv-val">{formatVolume(currentStock.averageVolume)}</div>
                  </div>
                  <div className="ohlcv-item">
                    <div className="ohlcv-label">52W High</div>
                    <div className="ohlcv-val" style={{ color: 'var(--green)' }}>{formatPrice(currentStock.fiftyTwoWeekHigh)}</div>
                  </div>
                  <div className="ohlcv-item">
                    <div className="ohlcv-label">52W Low</div>
                    <div className="ohlcv-val" style={{ color: 'var(--red)' }}>{formatPrice(currentStock.fiftyTwoWeekLow)}</div>
                  </div>
                </div>
              </div>

              {/* Historical Table */}
              <div className="hist-table-card">
                <div className="card-top">
                  <div className="card-title">Historical Price Data</div>
                  <Link to={`/prediction?ticker=${currentTicker}`} style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600' }}>
                    Predict Future →
                  </Link>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Open</th>
                        <th>High</th>
                        <th>Low</th>
                        <th>Close</th>
                        <th>Volume</th>
                        <th>Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...historyData].slice(-15).reverse().map((row, i, arr) => {
                        // Calculate change relative to previous row in array
                        const prev = historyData[historyData.indexOf(row) - 1] || row;
                        const diff = row.close - prev.close;
                        const pct = prev.close !== 0 ? ((diff / prev.close) * 100).toFixed(2) : '0.00';
                        const isUp = diff >= 0;

                        return (
                          <tr key={row.date}>
                            <td>{formatDate(row.date)}</td>
                            <td>{formatPrice(row.open)}</td>
                            <td style={{ color: 'var(--green)' }}>{formatPrice(row.high)}</td>
                            <td style={{ color: 'var(--red)' }}>{formatPrice(row.low)}</td>
                            <td style={{ fontWeight: '600' }}>{formatPrice(row.close)}</td>
                            <td>{formatVolume(row.volume)}</td>
                            <td style={{ color: isUp ? 'var(--green)' : 'var(--red)', fontWeight: '600' }}>
                              {isUp ? '+' : ''}{pct}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
