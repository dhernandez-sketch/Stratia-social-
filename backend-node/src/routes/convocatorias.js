const express = require('express');
const router = express.Router();
const convocatoriaController = require('../controllers/convocatoriaController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Convocatoria routes
router.post('/', convocatoriaController.createConvocatoria);
router.post('/bulk-import', convocatoriaController.bulkImportConvocatorias);
router.post('/:id/evaluate/:organizationId', convocatoriaController.evaluateCompatibility);
router.get('/', convocatoriaController.getConvocatorias);
router.get('/top-matches/:organizationId', convocatoriaController.getTopMatches);
router.get('/:id', convocatoriaController.getConvocatoriaById);
router.put('/:id', convocatoriaController.updateConvocatoria);
router.delete('/:id', convocatoriaController.deleteConvocatoria);

module.exports = router;
