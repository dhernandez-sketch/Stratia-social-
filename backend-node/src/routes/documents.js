const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Document routes
router.post('/', documentController.uploadDocument);
router.post('/:id/process', documentController.processDocument);
router.get('/', documentController.getDocuments);
router.get('/:id', documentController.getDocumentById);
router.delete('/:id', documentController.deleteDocument);

module.exports = router;
