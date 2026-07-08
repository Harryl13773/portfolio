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

// Trust Render's proxy so rate limiters see real visitor IPs
app.set('trust proxy', 1);

// CORS allowlist — add/remove entries as domains change
const allowedOrigins = [
  'http://localhost:5173',                     // local dev
  'https://harrylian.com',                     // production
  'https://www.harrylian.com',                 // production (www)
  'https://portfolio.lian-000155.workers.dev', // origin URL
];

// Middleware — registered before the routes that rely on it
app.use(cors({ origin: allowedOrigins }));
app.use(express.json()); // parse JSON request bodies

// Health check route
app.get('/', (req, res) => {
  res.send('Portfolio API is running!');
});

// Routes
app.use('/api', visitsRoutes);           // POST /api/visit, GET /api/visits
app.use('/api/projects', projectRoutes); // GET /api/projects
app.use('/api/contact', contactRoutes);  // POST /api/contact

// Use PORT from .env, defaulting to 3001
const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
