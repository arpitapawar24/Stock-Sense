import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo" style={{ color: 'white' }}>
              <div className="logo-icon">
                <svg viewBox="0 0 20 20" fill="none">
                  <polyline points="2,14 6,9 10,11 14,5 18,7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <polyline points="14,5 18,5 18,9" stroke="white" stroke-width="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              StockSense
            </div>
            <p>An ML-powered stock market prediction platform built for academic research. Analyze patterns, forecast prices, and understand market trends.</p>
          </div>
          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/prediction">Price Predictor</Link></li>
              <li><Link to="/prediction">Technical Analysis</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/about#team">Our Team</Link></li>
              <li><Link to="/about#tech">Tech Stack</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#disclaimer">Disclaimer</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Use</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>
            <div className="footer-copy">© 2024 StockSense · AIDS 6A · Arpita Pawar, Ayush Singh, Anika Sahu</div>
          </div>
          <div className="footer-disclaimer">
            ⚠️ Disclaimer: StockSense is an academic project for educational purposes only. Predictions are based on historical data and ML models. Do not use this as financial advice for real investments.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
