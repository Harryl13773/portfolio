//loading environment variables from .env
require('dotenv').config()

//import packages
const express = require('express')
const cors = require('cors')
const projectRoutes = require('./routes/projects')
const contactRoutes = require('./routes/contact')

//create Express app
const app = express()
app.use(cors())          //allow requests from React frontend
app.use(express.json())  //allow server to read JSON data sent in request bodies

// a test route
app.get('/', (req, res) => {
  res.send('Portfolio API is running!')
})

//routes
app.use('/api/projects', projectRoutes)  //GET /api/projects
app.use('/api/contact', contactRoutes)   //POST /api/contact

//use the PORT from the .env file, or default to 3001 if not set
const PORT = process.env.PORT || 3001

//starting server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))