import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="about-page fade-up">
      {/* Hero */}
      <div className="about-hero">
        <div className="section-badge">About the Project</div>
        <h1>StockSense</h1>
        <p>An academic MERN project that predicts stock market trends using historical price data, machine learning algorithms, and technical analysis.</p>
      </div>

      <div className="about-content">
        {/* Project Aim */}
        <div className="aim-card">
          <div className="aim-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            Project Aim
          </div>
          <p>
            This project aims to predict stock market trends using historical stock data and machine learning techniques.
            The system analyzes past stock prices such as open, high, low, close price and volume to identify patterns
            and forecast future stock prices or market movement. The main objective is to help users understand possible
            stock trends and support better decision-making. Various data preprocessing, feature selection, and prediction
            methods are used to improve accuracy.
          </p>
        </div>

        <hr className="about-divider" />

        {/* Team */}
        <div id="team">
          <h2 className="section-h2">👥 Our Team</h2>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-avatar av-blue">AP</div>
              <div className="team-name">Arpita Pawar</div>
            </div>
            <div className="team-card">
              <div className="team-avatar av-purple">AS</div>
              <div className="team-name">Ayush Singh</div>
            </div>
            <div className="team-card">
              <div className="team-avatar av-teal">AS</div>
              <div className="team-name">Anika Sahu</div>
            </div>
          </div>
        </div>

        <hr className="about-divider" />

        {/* What We Predict */}
        <h2 className="section-h2">🧠 How We Predict Stock Prices</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '48px' }}>
          <div className="tech-item" style={{ padding: '20px 24px', textAlign: 'left' }}>
            <div className="tech-emoji" style={{ textAlign: 'left', marginBottom: '10px' }}>📐</div>
            <div className="tech-name" style={{ fontSize: '15px', marginBottom: '8px' }}>Linear Regression</div>
            <div className="tech-use" style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-700)' }}>
              Fits a straight-line trend through 6 months of closing prices using the least-squares method.
              Identifies slope (trend direction) and extends it forward to predict future prices.
              Calculated dynamically in our Express backend.
            </div>
          </div>
          <div className="tech-item" style={{ padding: '20px 24px', textAlign: 'left' }}>
            <div className="tech-emoji" style={{ textAlign: 'left', marginBottom: '10px' }}>📊</div>
            <div className="tech-name" style={{ fontSize: '15px', marginBottom: '8px' }}>Simple Moving Average (SMA)</div>
            <div className="tech-use" style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-700)' }}>
              Calculates rolling averages over 20 and 50-day windows. When the SMA-20 crosses above
              SMA-50, it's a bullish signal (Golden Cross). When it crosses below, it's bearish (Death Cross).
            </div>
          </div>
          <div className="tech-item" style={{ padding: '20px 24px', textAlign: 'left' }}>
            <div className="tech-emoji" style={{ textAlign: 'left', marginBottom: '10px' }}>⚡</div>
            <div className="tech-name" style={{ fontSize: '15px', marginBottom: '8px' }}>RSI — Relative Strength Index</div>
            <div className="tech-use" style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-700)' }}>
              Measures the speed of price changes over the last 14 days. RSI below 30 = oversold (BUY signal).
              RSI above 70 = overbought (SELL signal). RSI between 30–70 = neutral HOLD.
            </div>
          </div>
          <div className="tech-item" style={{ padding: '20px 24px', textAlign: 'left' }}>
            <div className="tech-emoji" style={{ textAlign: 'left', marginBottom: '10px' }}>📉</div>
            <div className="tech-name" style={{ fontSize: '15px', marginBottom: '8px' }}>MACD</div>
            <div className="tech-use" style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-700)' }}>
              Moving Average Convergence Divergence: difference between 12-day EMA and 26-day EMA.
              Positive MACD = bullish momentum (BUY). Negative MACD = bearish (SELL).
            </div>
          </div>
        </div>

        <hr className="about-divider" />

        {/* Tech Stack */}
        <div id="tech">
          <h2 className="section-h2">🛠️ MERN Technology Stack</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <div className="tech-emoji">⚛️</div>
              <div className="tech-name">React.js</div>
              <div className="tech-use">Frontend UI</div>
            </div>
            <div className="tech-item">
              <div className="tech-emoji">🟢</div>
              <div className="tech-name">Node.js + Express</div>
              <div className="tech-use">API Web Server</div>
            </div>
            <div className="tech-item">
              <div className="tech-emoji">🍃</div>
              <div className="tech-name">MongoDB Atlas</div>
              <div className="tech-use">Cloud Database</div>
            </div>
            <div className="tech-item">
              <div className="tech-emoji">🔑</div>
              <div className="tech-name">JWT Authentication</div>
              <div className="tech-use">Session Security</div>
            </div>
            <div className="tech-item">
              <div className="tech-emoji">📊</div>
              <div className="tech-name">Chart.js</div>
              <div className="tech-use">Data Visualization</div>
            </div>
            <div className="tech-item">
              <div className="tech-emoji">📐</div>
              <div className="tech-name">Linear Regression</div>
              <div className="tech-use">Server-Side Forecast</div>
            </div>
            <div className="tech-item">
              <div className="tech-emoji">📈</div>
              <div className="tech-name">Moving Averages</div>
              <div className="tech-use">Indicator Engine</div>
            </div>
            <div className="tech-item">
              <div className="tech-emoji">🔢</div>
              <div className="tech-name">R² Confidence</div>
              <div className="tech-use">R-squared Scoring</div>
            </div>
          </div>
        </div>

        <hr className="about-divider" />

        {/* Data */}
        <h2 className="section-h2">📦 Seeded Database Source</h2>
        <div className="aim-card" style={{ background: 'var(--bg-gray)', borderColor: 'var(--border)' }}>
          <div className="aim-label" style={{ color: 'var(--text-500)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            Data Source
          </div>
          <p>
            StockSense uses a custom-seeded database containing 365 days of mathematically simulated stock data
            for 8 global companies: AAPL, MSFT, TSLA, GOOGL, AMZN, META, NVDA, and NFLX. The dataset simulates real market
            behaviors such as volatility, technical support indicators, and momentum trends.
            <br /><br />
            Our backend utilizes a seed generator script which populates the Mongo database on startup, ensuring full
            OHLCV data modeling is available locally or on cloud environments without dependency on external third-party price feeds.
          </p>
        </div>

        <hr className="about-divider" />

        {/* Disclaimer */}
        <div style={{ background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: 'var(--radius-lg)', padding: '20px 24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#9A3412', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>⚠️ Academic Disclaimer</div>
          <p style={{ fontSize: '14px', color: '#7C2D12', lineHeight: 1.7 }}>
            StockSense is an academic project developed for college curricular research. All calculations are performed on seeded mock datasets.
            This application is not suitable for, nor should it be used for, managing real investments or real-world trading.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
