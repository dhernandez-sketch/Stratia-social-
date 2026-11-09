const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  mission: {
    type: String,
    trim: true
  },
  vision: {
    type: String,
    trim: true
  },
  legalStatus: {
    type: String,
    enum: ['A.C.', 'A.C.', 'ONG', 'Fundación', 'Otro'],
    default: 'A.C.'
  },
  location: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  reports: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report'
  }],
  convocatorias: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Convocatoria'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Organization', organizationSchema);
