const mongoose = require('mongoose');

const OHLCVSchema = new mongoose.Schema({
  date:   { type: Date,   required: true },
  open:   { type: Number, required: true },
  high:   { type: Number, required: true },
  low:    { type: Number, required: true },
  close:  { type: Number, required: true },
  volume: { type: Number, required: true },
}, { _id: false });

const StockSchema = new mongoose.Schema({
  ticker:    { type: String, required: true, unique: true, uppercase: true },
  name:      { type: String, required: true },
  exchange:  { type: String, required: true },
  sector:    { type: String, required: true },
  basePrice: { type: Number, required: true },
  history:   [OHLCVSchema],
}, { timestamps: true });

// Index for fast ticker lookups
StockSchema.index({ ticker: 1 });

module.exports = mongoose.model('Stock', StockSchema);
