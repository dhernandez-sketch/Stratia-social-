const Report = require('../models/Report');
const Organization = require('../models/Organization');
const Document = require('../models/Document');
const AIService = require('../services/aiService');

exports.createReport = async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.generateReportContent = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const organization = await Organization.findById(report.organization);
    
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Get documents from organization
    const documents = await Document.find({
      organization: report.organization,
      status: 'completed'
    });

    // Prepare context
    let documentsSummary = '';
    documents.forEach(doc => {
      if (doc.extractedText) {
        documentsSummary += `\n\n--- ${doc.originalName} ---\n${doc.extractedText.substring(0, 2000)}`;
      }
    });

    const organizationContext = `
    Nombre: ${organization.name}
    Misión: ${organization.mission || 'No especificada'}
    Visión: ${organization.vision || 'No especificada'}
    Descripción: ${organization.description || 'No especificada'}
    `;

    // Generate narrative content
    const aiService = new AIService();
    const content = await aiService.generateNarrativeReport(
      report.reportType,
      { documents: documentsSummary },
      organization.name
    );

    report.content = content;
    report.status = 'published';
    await report.save();

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    const { organizationId, page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;
    
    let query = Report.find();
    
    if (organizationId) {
      query = query.where('organization').equals(organizationId);
    }
    
    if (status) {
      query = query.where('status').equals(status);
    }
    
    const reports = await query
      .populate('organization', 'name')
      .populate('createdBy', 'fullName email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Report.countDocuments(query);
    
    res.json({
      reports,
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

exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('organization', 'name')
      .populate('createdBy', 'fullName email');
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.exportReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const { format, organizationName } = req.query;
    
    if (!report.content) {
      return res.status(400).json({ error: 'Report content not generated yet' });
    }

    // Generate HTML content
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${report.title}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2, h3 { color: #2c3e50; }
        h1 { border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        .header { text-align: center; margin-bottom: 40px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; }
        .organization { font-size: 18px; margin-top: 10px; }
        .content { margin-top: 30px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f8f9fa; font-weight: bold; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #7f8c8d; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${report.title}</h1>
        <div class="organization">${organizationName || 'Organización'}</div>
      </div>
      <div class="content">
        ${formatContent(report.content)}
      </div>
      <div class="footer">
        <p>Generado automáticamente por Sistema de Informes Narrativos para A.C.</p>
      </div>
    </body>
    </html>
    `;

    if (format === 'html') {
      res.setHeader('Content-Type', 'text/html');
      res.send(htmlContent);
    } else if (format === 'pdf') {
      // For PDF, we'd need a library like puppeteer or wkhtmltopdf
      // For now, return HTML with note
      res.json({
        content: htmlContent,
        format: 'pdf',
        note: 'PDF generation requires additional setup. Use HTML format for now.'
      });
    } else if (format === 'md') {
      const markdownContent = `# ${report.title}\n\n**Organización:** ${organizationName || 'Organización'}\n\n---\n\n${report.content}\n\n---\n\n*Generado automáticamente por Sistema de Informes Narrativos para A.C.*`;
      res.setHeader('Content-Type', 'text/markdown');
      res.send(markdownContent);
    } else {
      res.status(400).json({ error: 'Unsupported format' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to format markdown content to HTML
function formatContent(content) {
  if (!content) return '';
  
  let html = content;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Line breaks
  html = html.replace(/\n/g, '<br>');
  
  // Lists
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  return html;
}
