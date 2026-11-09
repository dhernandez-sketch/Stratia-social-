const mongoose = require('mongoose');

const diagnosticResultSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  diagnosticType: {
    type: String,
    enum: ['foda', 'institucional', 'cadena_valor', 'strategic_plan', 'otro'],
    required: true
  },
  results: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  recommendations: [{
    type: mongoose.Schema.Types.Mixed
  }],
  score: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DiagnosticResult', diagnosticResultSchema);
