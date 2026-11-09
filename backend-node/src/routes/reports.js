const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Report routes
router.post('/', reportController.createReport);
router.post('/:id/generate', reportController.generateReportContent);
router.get('/', reportController.getReports);
router.get('/:id', reportController.getReportById);
router.put('/:id', reportController.updateReport);
router.delete('/:id', reportController.deleteReport);
router.get('/:id/export/:format', reportController.exportReport);

module.exports = router;
