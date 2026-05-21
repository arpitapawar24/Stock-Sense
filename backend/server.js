const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/stocks',      require('./routes/stocks'));
app.use('/api/predictions', require('./routes/predictions'));
app.use('/api/watchlist',   require('./routes/watchlist'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: '✅ StockSense API is running', version: '1.0.0' });
});

// ── Error Handler ────────────────────────────────────────────────────────────
app.use(require('./middleware/errorHandler'));

// ── MongoDB Connection ───────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 StockSense server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
