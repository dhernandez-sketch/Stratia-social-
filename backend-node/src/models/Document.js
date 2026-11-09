const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'xlsx', 'xls', 'pptx', 'ppt', 'docx', 'doc'],
    required: true
  },
  fileSize: {
    type: Number
  },
  documentType: {
    type: String,
    enum: ['informe_anual', 'acta', 'estado_financiero', 'propuesta_proyecto', 'politica', 'manual', 'otro'],
    default: 'otro'
  },
  extractedText: {
    type: String
  },
  extractedData: {
    type: mongoose.Schema.Types.Mixed
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  errorMessage: {
    type: String
  },
  processedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);
