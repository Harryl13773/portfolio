import './ProjectCard.css'

// This component receives one "project" object as a prop
// and displays it as a styled card
function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <h3 className="project-title">{project.title}</h3>
      <p className="project-description">{project.description}</p>

      <div className="project-tech">
        {project.tech.map((item) => (
          <span key={item} className="tech-pill">{item}</span>
        ))}
      </div>

      <div className="project-links">
        {project.github && (
          <a href={project.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        )}
        {project.live && (
          <a href={project.live} target="_blank" rel="noreferrer">
            Live Demo
          </a>
        )}
      </div>
    </div>
  )
}

export default ProjectCard