// Router for the portfolio projects list
const express = require('express');
const router = express.Router();

// Load project data (require resolves relative to this file)
const projects = require('../data/projects.json');

// GET /api/projects — return the list of projects
router.get('/', (req, res) => {
  res.json(projects);
});

// Export this router so server.js can use it
module.exports = router;
