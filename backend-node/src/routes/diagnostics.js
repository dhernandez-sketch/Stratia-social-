const express = require('express');
const router = express.Router();
const diagnosticController = require('../controllers/diagnosticController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Diagnostic routes
router.post('/', diagnosticController.createDiagnostic);
router.post('/foda/:organizationId', diagnosticController.generateFODADiagnostic);
router.post('/strategic-plan/:organizationId', diagnosticController.generateStrategicPlan);
router.get('/', diagnosticController.getDiagnostics);
router.get('/:id', diagnosticController.getDiagnosticById);
router.delete('/:id', diagnosticController.deleteDiagnostic);

module.exports = router;
