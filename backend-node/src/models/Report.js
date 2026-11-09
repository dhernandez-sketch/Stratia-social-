const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  reportType: {
    type: String,
    enum: ['diagnostico', 'convocatorias', 'planeacion', 'informe_anual', 'proyecto', 'otro'],
    required: true
  },
  content: {
    type: String
  },
  structuredData: {
    type: mongoose.Schema.Types.Mixed
  },
  templateUsed: {
    type: String
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);
