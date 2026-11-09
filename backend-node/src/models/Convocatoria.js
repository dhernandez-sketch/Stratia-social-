const mongoose = require('mongoose');

const convocatoriaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  funder: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  requirements: {
    type: String,
    trim: true
  },
  deadline: {
    type: Date
  },
  amount: {
    type: Number
  },
  currency: {
    type: String,
    enum: ['MXN', 'USD', 'EUR'],
    default: 'MXN'
  },
  thematicArea: {
    type: String,
    trim: true
  },
  eligibilityCriteria: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    trim: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  compatibilityScore: {
    type: Number,
    min: 0,
    max: 100
  },
  compatibilityAnalysis: {
    type: mongoose.Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'applied'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Convocatoria', convocatoriaSchema);
