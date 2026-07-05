//loading environment variables from .env
require('dotenv').config()

//import packages
const express = require('express')
const cors = require('cors')
const projectRoutes = require('./routes/projects')
const contactRoutes = require('./routes/contact')

//create Express app
const app = express()

//able to read real visitor's IP for the rate limiter to work
app.set('trust proxy', 1)

// CORS: only these origins may call the API from a browser.
// Add/remove entries as your domains change.
const allowedOrigins = [
  'http://localhost:5173',        // local dev
  'https://harrylian.com',        // production
  'https://www.harrylian.com',    // production (www)
  'https://portfolio.lian-000155.workers.dev', //origin URL
]
app.use(cors({ origin: allowedOrigins }))

app.use(express.json()) //allow server to read JSON data sent in request bodies

// a test route (also useful as a health check after deploying)
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