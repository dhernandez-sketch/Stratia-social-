const Document = require('../models/Document');
const DocumentProcessor = require('../services/documentProcessor');
const AIService = require('../services/aiService');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

exports.uploadDocument = [
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { organizationId, documentType, uploadedBy } = req.body;
      
      if (!organizationId || !uploadedBy) {
        return res.status(400).json({ error: 'Organization ID and uploaded by are required' });
      }

      const fileExtension = path.extname(req.file.originalname).toLowerCase().slice(1);
      
      const document = new Document({
        filename: req.file.filename,
        originalName: req.file.originalname,
        filePath: req.file.path,
        fileType: fileExtension,
        fileSize: req.file.size,
        documentType: documentType || 'otro',
        organization: organizationId,
        uploadedBy: uploadedBy,
        status: 'pending'
      });

      await document.save();
      res.status(201).json(document);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
];

exports.processDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    document.status = 'processing';
    await document.save();

    // Process document
    const result = await DocumentProcessor.processDocument(document.filePath, document.fileType);
    
    if (result.error) {
      document.status = 'failed';
      document.errorMessage = result.error;
    } else {
      document.status = 'completed';
      document.extractedData = result;
      document.extractedText = result.text || '';
      document.processedAt = new Date();

      // Analyze with AI if text is available
      if (result.text && result.text.length > 100) {
        const aiService = new AIService();
        const analysis = await aiService.analyzeDocument(
          result.text,
          document.documentType
        );
        document.extractedData.aiAnalysis = analysis;
      }
    }

    await document.save();
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const { organizationId, page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;
    
    let query = Document.find();
    
    if (organizationId) {
      query = query.where('organization').equals(organizationId);
    }
    
    if (status) {
      query = query.where('status').equals(status);
    }
    
    const documents = await query
      .populate('organization', 'name')
      .populate('uploadedBy', 'fullName email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Document.countDocuments(query);
    
    res.json({
      documents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('organization', 'name')
      .populate('uploadedBy', 'fullName email');
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete file from filesystem
    try {
      await fs.unlink(document.filePath);
    } catch (fsError) {
      console.error('Error deleting file:', fsError);
    }

    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
