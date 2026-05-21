import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';

const Home = () => {
  const location = useLocation();

  // Smooth scroll logic for hashes on landing page load or change
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      }
    }
  }, [location]);

  return (
    <div className="fade-up">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge"><span>✦</span> ML-Powered Stock Intelligence</div>
          <h1 className="hero-title">
            Predict. Invest.<br className="hero-br" />
            <span className="accent">Grow smarter.</span>
          </h1>
          <p className="hero-subtitle">
            Analyze global stock trends using historical OHLCV data and machine learning.
            Forecast future prices and make data-driven investment decisions.
          </p>
          <div className="hero-cta">
            <Link to="/dashboard" className="btn-primary">
              Open Dashboard
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
            <Link to="/prediction" className="btn-outline">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Try Prediction
            </Link>
          </div>

          {/* Dashboard Mockup */}
          <div className="hero-mockup-wrapper">
            <div className="hero-mockup">
              <div className="mockup-topbar">
                <div className="mockup-dot red"></div>
                <div className="mockup-dot yellow"></div>
                <div className="mockup-dot green"></div>
                <div className="mockup-urlbar"><span>stocksense.app/dashboard</span></div>
              </div>
              <div className="mockup-body">
                {/* Sidebar */}
                <div className="mockup-sidebar">
                  <div className="mockup-sidebar-header">Watchlist</div>
                  <div className="ms-item active">
                    <div><div className="ms-sym">AAPL</div><div className="ms-name">Apple Inc.</div></div>
                    <div><span className="ms-price">$182.45</span><span className="ms-chg up">+1.24%</span></div>
                  </div>
                  <div className="ms-item">
                    <div><div className="ms-sym">MSFT</div><div className="ms-name">Microsoft</div></div>
                    <div><span className="ms-price">$418.32</span><span className="ms-chg up">+0.87%</span></div>
                  </div>
                  <div className="ms-item">
                    <div><div className="ms-sym">TSLA</div><div className="ms-name">Tesla</div></div>
                    <div><span className="ms-price">$248.76</span><span className="ms-chg down">−1.43%</span></div>
                  </div>
                  <div className="ms-item">
                    <div><div className="ms-sym">GOOGL</div><div className="ms-name">Alphabet</div></div>
                    <div><span className="ms-price">$165.20</span><span className="ms-chg up">+2.05%</span></div>
                  </div>
                </div>
                {/* Main Area */}
                <div className="mockup-main-area">
                  <div className="mm-header">
                    <div>
                      <div className="mm-stock-title">Apple Inc. <span className="mm-stock-exchange">NASDAQ</span></div>
                      <div className="mm-price">$182.45</div>
                      <div className="mm-change">▲ +$2.23 (+1.24%) today</div>
                    </div>
                    <div className="mm-tabs">
                      <div className="mm-tab">1W</div>
                      <div className="mm-tab">1M</div>
                      <div className="mm-tab active">3M</div>
                      <div className="mm-tab">1Y</div>
                    </div>
                  </div>
                  {/* Mock Chart Area */}
                  <div className="mm-chart" style={{ padding: '20px 0' }}>
                    <svg viewBox="0 0 560 140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#16A34A" stopOpacity="0.15"/>
                          <stop offset="100%" stopColor="#16A34A" stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                      <path d="M0,120 L40,118 L80,112 L120,95 L160,88 L200,90 L240,72 L280,74 L320,55 L360,48 L400,38 L440,28 L480,25 L520,15 L560,8 L560,140 L0,140 Z" fill="url(#chartGrad)"/>
                      <path d="M0,120 L40,118 L80,112 L120,95 L160,88 L200,90 L240,72 L280,74 L320,55 L360,48 L400,38 L440,28 L480,25 L520,15 L560,8" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M480,25 L500,18 L520,11 L540,5 L560,0" fill="none" stroke="#F97316" strokeWidth="2" strokeDasharray="5,3" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="mm-ohlcv">
                    <div className="mm-ohlcv-item"><div className="mm-ohlcv-label">Open</div><div className="mm-ohlcv-val">$180.22</div></div>
                    <div className="mm-ohlcv-item"><div className="mm-ohlcv-label">High</div><div className="mm-ohlcv-val">$183.90</div></div>
                    <div className="mm-ohlcv-item"><div className="mm-ohlcv-label">Low</div><div className="mm-ohlcv-val">$179.50</div></div>
                    <div className="mm-ohlcv-item"><div className="mm-ohlcv-label">Close</div><div className="mm-ohlcv-val">$182.45</div></div>
                    <div className="mm-ohlcv-item"><div className="mm-ohlcv-label">Volume</div><div className="mm-ohlcv-val">54.2M</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="stats-section">
        <div className="stats-inner">
          <div className="stat-item">
            <span className="stat-number"><span className="stat-accent">8</span>+</span>
            <div className="stat-label">Global Stocks Tracked</div>
          </div>
          <div className="stat-item">
            <span className="stat-number">365 Days</span>
            <div className="stat-label">Historical Data per Stock</div>
          </div>
          <div className="stat-item">
            <span className="stat-number">4 Models</span>
            <div className="stat-label">ML Prediction Algorithms</div>
          </div>
          <div className="stat-item">
            <span className="stat-number">Zero Cost</span>
            <div className="stat-label">Free to Use, Always</div>
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="features-section" id="features">
        <div className="section-inner">
          <div className="section-badge">Features</div>
          <h2 class="section-title">Everything you need to predict the market</h2>
          <p class="section-subtitle">From raw OHLCV data to accurate price forecasts — all in one clean, intuitive platform.</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <div className="feature-title">Interactive Stock Charts</div>
              <div className="feature-desc">Visualize historical OHLCV data with smooth, interactive line charts. Switch between timeframes instantly.</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
              <div className="feature-title">ML Price Prediction</div>
              <div className="feature-desc">Linear Regression and Moving Average models forecast future stock prices 7, 15, or 30 days ahead with confidence scoring.</div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24"><path d="M2 20h20M6 20V10M12 20V4M18 20v-8"/></svg>
              </div>
              <div className="feature-title">Technical Indicators</div>
              <div className="feature-desc">SMA-20, SMA-50, EMA, RSI, and MACD signals displayed with clear BUY/SELL/HOLD recommendations.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="hiw-section" id="how-it-works">
        <div className="section-inner">
          <div className="section-badge">How It Works</div>
          <h2 class="section-title">Three steps to smarter investing</h2>
          <p class="section-subtitle">StockSense makes it simple to go from raw data to actionable predictions.</p>
          <div className="hiw-grid">
            <div className="hiw-step">
              <div className="step-num">1</div>
              <div className="step-title">Select a Stock</div>
              <div className="step-desc">Choose from 8 global stocks including Apple, Microsoft, Tesla, Google, Amazon, Meta, NVIDIA, and Netflix.</div>
            </div>
            <div className="hiw-step">
              <div className="step-num">2</div>
              <div className="step-title">Analyze Data</div>
              <div className="step-desc">View interactive OHLCV charts, technical indicators, historical price tables, and volume patterns.</div>
            </div>
            <div className="hiw-step">
              <div className="step-num">3</div>
              <div className="step-title">Get Predictions</div>
              <div className="step-desc">Run our Linear Regression or Moving Average ML models to get future price forecasts with confidence scores.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="products-section" id="products">
        <div className="section-inner">
          <div className="section-badge">Our Tools</div>
          <h2 class="section-title">Everything in one platform</h2>
          <p class="section-subtitle">Four powerful tools — built for students, researchers, and retail investors alike.</p>
          <div className="products-grid">
            <div className="product-card">
              <div className="product-icon" style={{ background: '#EBF3FF' }}>📊</div>
              <div>
                <div className="product-name">StockSense Dashboard</div>
                <div className="product-desc">Interactive stock dashboard with real-time charts, watchlist, and OHLCV data visualization.</div>
              </div>
            </div>
            <div className="product-card">
              <div className="product-icon" style={{ background: '#FEF9C3' }}>🔮</div>
              <div>
                <div className="product-name">Price Predictor</div>
                <div className="product-desc">ML-powered future price forecasting using Linear Regression and Moving Averages.</div>
              </div>
            </div>
            <div className="product-card">
              <div className="product-icon" style={{ background: '#DCFCE7' }}>📈</div>
              <div>
                <div className="product-name">Technical Indicators</div>
                <div className="product-desc">SMA, EMA, RSI, and MACD indicators with automatic BUY / SELL / HOLD signals.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="pricing-section" id="pricing">
        <div className="section-inner">
          <div className="section-badge">Pricing</div>
          <h2 class="section-title">Simple, transparent pricing</h2>
          <p class="section-subtitle">StockSense is a research and academic project — free for everyone to use.</p>
          <div className="pricing-table">
            <div className="pricing-row header-row">
              <div className="pricing-cell header-cell">Feature</div>
              <div className="pricing-cell header-cell">Basic</div>
              <div className="pricing-cell header-cell">Standard</div>
              <div className="pricing-cell header-cell">Pro</div>
            </div>
            <div className="pricing-row">
              <div className="pricing-cell">Stock Charts (OHLCV)</div>
              <div className="pricing-cell"><span className="price-free">✓</span></div>
              <div className="pricing-cell"><span className="price-free">✓</span></div>
              <div className="pricing-cell"><span className="price-free">✓</span></div>
            </div>
            <div className="pricing-row">
              <div className="pricing-cell">ML Price Prediction</div>
              <div className="pricing-cell" style={{ color: 'var(--text-300)' }}>—</div>
              <div className="pricing-cell"><span className="price-free">✓</span></div>
              <div className="pricing-cell"><span className="price-free">✓</span></div>
            </div>
            <div className="pricing-row">
              <div className="pricing-cell">Technical Indicators</div>
              <div className="pricing-cell" style={{ color: 'var(--text-300)' }}>—</div>
              <div className="pricing-cell"><span className="price-free">✓</span></div>
              <div className="pricing-cell"><span className="price-free">✓</span></div>
            </div>
            <div className="pricing-row">
              <div className="pricing-cell" style={{ fontWeight: 700 }}>Monthly Cost</div>
              <div className="pricing-cell"><span className="price-free" style={{ fontSize: '22px' }}>Free</span></div>
              <div className="pricing-cell"><span className="price-free" style={{ fontSize: '22px' }}>Free</span></div>
              <div className="pricing-cell"><span className="price-free" style={{ fontSize: '22px' }}>Free</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="cta-section" id="get-started">
        <div className="section-inner">
          <h2 class="section-title">Ready to predict your first stock?</h2>
          <p class="section-subtitle">Open the dashboard, pick a stock, and run your first ML prediction in under 60 seconds.</p>
          <Link to="/dashboard" className="btn-white">
            Open Dashboard →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
