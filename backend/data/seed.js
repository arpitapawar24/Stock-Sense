// data/seed.js — Seeds MongoDB with 365 days of mock OHLCV data for 8 global stocks
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Stock = require('../models/Stock');

dotenv.config({ path: require('path').join(__dirname, '../.env') });

const STOCKS_INFO = [
  { ticker: 'AAPL', name: 'Apple Inc.',      exchange: 'NASDAQ', sector: 'Technology',    basePrice: 178, volatility: 1.8, trend: 0.025 },
  { ticker: 'GOOGL',name: 'Alphabet Inc.',   exchange: 'NASDAQ', sector: 'Technology',    basePrice: 162, volatility: 2.0, trend: 0.030 },
  { ticker: 'TSLA', name: 'Tesla Inc.',      exchange: 'NASDAQ', sector: 'Automotive',    basePrice: 245, volatility: 3.5, trend: 0.015 },
  { ticker: 'MSFT', name: 'Microsoft Corp.', exchange: 'NASDAQ', sector: 'Technology',    basePrice: 415, volatility: 1.5, trend: 0.035 },
  { ticker: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ', sector: 'E-Commerce',    basePrice: 198, volatility: 2.2, trend: 0.028 },
  { ticker: 'META', name: 'Meta Platforms',  exchange: 'NASDAQ', sector: 'Social Media',  basePrice: 512, volatility: 2.8, trend: 0.040 },
  { ticker: 'NVDA', name: 'NVIDIA Corp.',    exchange: 'NASDAQ', sector: 'Semiconductors',basePrice: 875, volatility: 3.2, trend: 0.050 },
  { ticker: 'NFLX', name: 'Netflix Inc.',    exchange: 'NASDAQ', sector: 'Streaming',     basePrice: 628, volatility: 2.6, trend: 0.020 },
];

// Seeded random (consistent data every seed)
function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

function generateHistory(info) {
  const rng = seededRandom(info.ticker.charCodeAt(0) * 1000 + info.ticker.charCodeAt(1) * 100);
  const history = [];
  let price = info.basePrice * 0.82;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const dailyReturn = (rng() - 0.49) * info.volatility / 100 + info.trend / 252;
    price = price * (1 + dailyReturn);

    const close  = +price.toFixed(2);
    const open   = +(close * (1 + (rng() - 0.5) * 0.012)).toFixed(2);
    const high   = +(Math.max(open, close) * (1 + rng() * 0.018)).toFixed(2);
    const low    = +(Math.min(open, close) * (1 - rng() * 0.018)).toFixed(2);
    const baseVol = info.basePrice < 200 ? 12000000 : 4000000;
    const volume = Math.floor((rng() * 0.7 + 0.65) * baseVol);

    history.push({ date, open, high, low, close, volume });
  }
  return history;
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    await Stock.deleteMany({});
    console.log('🗑️  Cleared existing stock data');

    for (const info of STOCKS_INFO) {
      const history = generateHistory(info);
      await Stock.create({
        ticker:    info.ticker,
        name:      info.name,
        exchange:  info.exchange,
        sector:    info.sector,
        basePrice: info.basePrice,
        history,
      });
      console.log(`✅ Seeded ${info.ticker} — ${history.length} trading days`);
    }

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
