const express = require('express');
const cors = require('cors');

const bugRoutes = require('./routes/bugs');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Middleware
app.use(express.json());

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`, req.body || '');
  next();
});

// Routes
app.use('/api/bugs', bugRoutes);

// Test route to verify backend is working
app.get('/api/health', (req, res) => {
  console.log('Health check route hit');
  res.json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    database: 'In-memory storage'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bug Tracker API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      bugs: '/api/bugs'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔗 Backend API: http://localhost:${PORT}/api`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
  console.log(`💾 Using in-memory database (no MongoDB required)`);
});

module.exports = app;