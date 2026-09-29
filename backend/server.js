// Load environment variables from .env
require('dotenv').config();

// Import packages
const express = require('express');
const cors = require('cors');
const projectRoutes = require('./routes/projects');
const contactRoutes = require('./routes/contact');
const visitsRoutes = require('./routes/visits');

// Create the Express app
const app = express();

// Trust Render's proxy for real visitor IPs
app.set('trust proxy', 1);

// Allowed CORS origins
const allowedOrigins = [
  'http://localhost:5173',                     // local dev
  'https://harrylian.com',                     // production
  'https://www.harrylian.com',                 // production (www)
  'https://portfolio.lian-000155.workers.dev', // origin URL
];

// Middleware
app.use(cors({ origin: allowedOrigins }));
app.use(express.json()); // Parse JSON bodies

// Health check route
app.get('/', (req, res) => {
  res.send('Portfolio API is running!');
});

// Routes
app.use('/api', visitsRoutes);           // POST /api/visit, GET /api/visits
app.use('/api/projects', projectRoutes); // GET /api/projects
app.use('/api/contact', contactRoutes);  // POST /api/contact

// Port from .env, default 3001
const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
