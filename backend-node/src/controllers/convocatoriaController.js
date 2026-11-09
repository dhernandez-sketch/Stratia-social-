const Convocatoria = require('../models/Convocatoria');
const Organization = require('../models/Organization');
const AIService = require('../services/aiService');

exports.createConvocatoria = async (req, res) => {
  try {
    const convocatoria = new Convocatoria(req.body);
    await convocatoria.save();
    res.status(201).json(convocatoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.evaluateCompatibility = async (req, res) => {
  try {
    const convocatoria = await Convocatoria.findById(req.params.id);
    
    if (!convocatoria) {
      return res.status(404).json({ error: 'Convocatoria not found' });
    }

    const organization = await Organization.findById(req.params.organizationId);
    
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Prepare organization profile
    const organizationProfile = {
      name: organization.name,
      description: organization.description,
      mission: organization.mission,
      vision: organization.vision,
      legalStatus: organization.legalStatus,
      location: organization.location,
      thematicAreas: ['desarrollo social', 'educación', 'salud'] // This would be extracted from documents
    };

    // Prepare convocatoria data
    const convocatoriaData = {
      title: convocatoria.title,
      funder: convocatoria.funder,
      description: convocatoria.description,
      requirements: convocatoria.requirements,
      deadline: convocatoria.deadline,
      amount: convocatoria.amount,
      currency: convocatoria.currency,
      thematicArea: convocatoria.thematicArea,
      eligibilityCriteria: convocatoria.eligibilityCriteria
    };

    // Evaluate compatibility
    const aiService = new AIService();
    const evaluation = await aiService.evaluateConvocatoriaCompatibility(
      organizationProfile,
      convocatoriaData
    );

    // Update convocatoria with results
    convocatoria.compatibilityScore = evaluation.overall_score;
    convocatoria.compatibilityAnalysis = evaluation;
    convocatoria.organization = req.params.organizationId;

    await convocatoria.save();
    res.json(convocatoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.bulkImportConvocatorias = async (req, res) => {
  try {
    const convocatorias = req.body;
    
    if (!Array.isArray(convocatorias)) {
      return res.status(400).json({ error: 'Request body must be an array of convocatorias' });
    }

    const created = await Convocatoria.insertMany(convocatorias);
    res.status(201).json({
      message: `${created.length} convocatorias imported`,
      data: created
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getConvocatorias = async (req, res) => {
  try {
    const { organizationId, page = 1, limit = 10, minScore, status } = req.query;
    const skip = (page - 1) * limit;
    
    let query = Convocatoria.find();
    
    if (organizationId) {
      query = query.where('organization').equals(organizationId);
    }
    
    if (minScore) {
      query = query.where('compatibilityScore').gte(parseFloat(minScore));
    }
    
    if (status) {
      query = query.where('status').equals(status);
    }
    
    const convocatorias = await query
      .populate('organization', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Convocatoria.countDocuments(query);
    
    res.json({
      convocatorias,
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

exports.getConvocatoriaById = async (req, res) => {
  try {
    const convocatoria = await Convocatoria.findById(req.params.id)
      .populate('organization', 'name');
    
    if (!convocatoria) {
      return res.status(404).json({ error: 'Convocatoria not found' });
    }
    
    res.json(convocatoria);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTopMatches = async (req, res) => {
  try {
    const organizationId = req.params.organizationId;
    const limit = parseInt(req.query.limit) || 10;
    
    const convocatorias = await Convocatoria.find({
      organization: organizationId,
      compatibilityScore: { $exists: true, $ne: null }
    })
    .populate('organization', 'name')
    .sort({ compatibilityScore: -1 })
    .limit(limit);
    
    res.json({
      organizationId,
      matches: convocatorias,
      total: convocatorias.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateConvocatoria = async (req, res) => {
  try {
    const convocatoria = await Convocatoria.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!convocatoria) {
      return res.status(404).json({ error: 'Convocatoria not found' });
    }
    
    res.json(convocatoria);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteConvocatoria = async (req, res) => {
  try {
    const convocatoria = await Convocatoria.findByIdAndDelete(req.params.id);
    
    if (!convocatoria) {
      return res.status(404).json({ error: 'Convocatoria not found' });
    }
    
    res.json({ message: 'Convocatoria deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
