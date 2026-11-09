require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database connection
const mongoUri = process.env.MONGODB_URI;

if (mongoUri && mongoUri.includes('xxxxx')) {
  console.log('⚠️  MongoDB URI not configured. Using in-memory database for demo.');
  console.log('⚠️  Please configure MongoDB Atlas for production use.');
  // Use in-memory MongoDB for demo
  const { MongoMemoryServer } = require('mongodb-memory-server');
  MongoMemoryServer.create().then(mongoServer => {
    mongoose.connect(mongoServer.getUri()).then(() => {
      console.log('✅ Connected to in-memory MongoDB');
    });
  });
} else {
  mongoose.connect(mongoUri || 'mongodb://localhost:27017/narrative_reports', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));
}

// Routes
const authRoutes = require('./routes/auth');
const organizationRoutes = require('./routes/organizations');
const documentRoutes = require('./routes/documents');
const reportRoutes = require('./routes/reports');
const diagnosticRoutes = require('./routes/diagnostics');
const convocatoriaRoutes = require('./routes/convocatorias');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/organizations', organizationRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/diagnostics', diagnosticRoutes);
app.use('/api/v1/convocatorias', convocatoriaRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Sistema de Informes Narrativos para A.C. - Backend Node.js',
    version: '1.0.0',
    status: 'active'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/v1`);
});
