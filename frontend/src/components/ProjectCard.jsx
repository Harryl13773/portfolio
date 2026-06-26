import './ProjectCard.css'

function ProjectCard({ project }) {
  return (
    <div className="project-card">

      {/* Left column — project title */}
      <div className="project-left">
        <h3 className="project-title">{project.title}</h3>
      </div>

      {/* Center column — description, pills, and links all stacked */}
      <div className="project-center">
        <p className="project-description">{project.description}</p>

        {/* Tech pills sit directly under the description */}
        <div className="project-tech">
          {project.tech.map((item) => (
            <span key={item} className="tech-pill">{item}</span>
          ))}
        </div>

        {/* Links sit below the pills */}
        <div className="project-links">
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer">GitHub</a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer">Live Demo</a>
          )}
        </div>
      </div>

    </div>
  )
}

export default ProjectCard