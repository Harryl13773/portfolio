import { useState, useEffect } from 'react'
import ProjectCard from './components/ProjectCard'
import './App.css'

function App() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:3001/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data)
        setLoading(false)
      })
      .catch((err) => console.error('Error fetching projects:', err))
  }, [])

  if (loading) return <p>Loading projects...</p>

  return (
    <div className="app">
      <h1>My Projects</h1>
      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}

export default App