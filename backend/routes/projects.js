//using Express's Routers to define routes
const express = require('express')
const router = express.Router()

//Node's built-in module for working with file paths
const path = require('path')

//loading project data
const projects = require(path.join(__dirname, '../data/projects.json'))

//return the list of projects
router.get('/', (req, res)=>{
    res.json(projects)
})

//export this router so server.js can use it
module.exports = router