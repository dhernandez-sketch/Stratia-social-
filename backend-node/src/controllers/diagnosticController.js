const DiagnosticResult = require('../models/DiagnosticResult');
const Organization = require('../models/Organization');
const Document = require('../models/Document');
const AIService = require('../services/aiService');

exports.createDiagnostic = async (req, res) => {
  try {
    const diagnostic = new DiagnosticResult(req.body);
    await diagnostic.save();
    res.status(201).json(diagnostic);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.generateFODADiagnostic = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.organizationId);
    
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Get documents from organization
    const documents = await Document.find({
      organization: req.params.organizationId,
      status: 'completed'
    });

    // Prepare context
    const organizationContext = `
    Nombre: ${organization.name}
    Misión: ${organization.mission || 'No especificada'}
    Visión: ${organization.vision || 'No especificada'}
    Descripción: ${organization.description || 'No especificada'}
    Estatus legal: ${organization.legalStatus || 'No especificado'}
    `;

    let documentsSummary = '';
    documents.forEach(doc => {
      if (doc.extractedText) {
        documentsSummary += `\n\n--- ${doc.originalName} ---\n${doc.extractedText.substring(0, 2000)}`;
      }
    });

    // Generate FODA analysis
    const aiService = new AIService();
    const fodaResult = await aiService.generateFODAAnalysis(organizationContext, documentsSummary);

    // Calculate overall score
    const scores = fodaResult.score || {};
    const scoreValues = Object.values(scores);
    const overallScore = scoreValues.length > 0 ? scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length : 0;

    // Create diagnostic result
    const diagnostic = new DiagnosticResult({
      organization: req.params.organizationId,
      diagnosticType: 'foda',
      results: fodaResult,
      recommendations: Object.values(fodaResult.estrategias || {}).flat().map(strategy => ({
        action: strategy,
        priority: 'high'
      })),
      score: overallScore
    });

    await diagnostic.save();
    res.status(201).json(diagnostic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.generateStrategicPlan = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.organizationId);
    
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const timeframeYears = parseInt(req.query.timeframe_years) || 3;

    // Get previous diagnostics
    const diagnostics = await DiagnosticResult.find({
      organization: req.params.organizationId
    });

    const diagnosticResults = {};
    diagnostics.forEach(d => {
      diagnosticResults[d.diagnosticType] = d.results;
    });

    const organizationContext = `
    Nombre: ${organization.name}
    Misión: ${organization.mission || 'No especificada'}
    Visión: ${organization.vision || 'No especificada'}
    Descripción: ${organization.description || 'No especificada'}
    `;

    // Generate strategic plan
    const aiService = new AIService();
    const plan = await aiService.generateStrategicPlan(
      organizationContext,
      diagnosticResults,
      timeframeYears
    );

    // Create diagnostic result
    const diagnostic = new DiagnosticResult({
      organization: req.params.organizationId,
      diagnosticType: 'strategic_plan',
      results: plan,
      recommendations: (plan.proyectos_prioritarios || []).map(p => ({
        project: p.nombre,
        priority: 'high'
      })),
      score: null
    });

    await diagnostic.save();
    res.status(201).json(diagnostic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDiagnostics = async (req, res) => {
  try {
    const { organizationId, page = 1, limit = 10, diagnosticType } = req.query;
    const skip = (page - 1) * limit;
    
    let query = DiagnosticResult.find();
    
    if (organizationId) {
      query = query.where('organization').equals(organizationId);
    }
    
    if (diagnosticType) {
      query = query.where('diagnosticType').equals(diagnosticType);
    }
    
    const diagnostics = await query
      .populate('organization', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await DiagnosticResult.countDocuments(query);
    
    res.json({
      diagnostics,
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

exports.getDiagnosticById = async (req, res) => {
  try {
    const diagnostic = await DiagnosticResult.findById(req.params.id)
      .populate('organization', 'name');
    
    if (!diagnostic) {
      return res.status(404).json({ error: 'Diagnostic not found' });
    }
    
    res.json(diagnostic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDiagnostic = async (req, res) => {
  try {
    const diagnostic = await DiagnosticResult.findByIdAndDelete(req.params.id);
    
    if (!diagnostic) {
      return res.status(404).json({ error: 'Diagnostic not found' });
    }
    
    res.json({ message: 'Diagnostic deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
