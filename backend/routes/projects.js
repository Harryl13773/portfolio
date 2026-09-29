// Router for the portfolio projects list
const express = require('express');
const router = express.Router();

// Load project data
const projects = require('../data/projects.json');

// GET /api/projects: return all projects
router.get('/', (req, res) => {
  res.json(projects);
});

// Export the router
module.exports = router;
