import { useLightbox } from '../lib/lightbox-context'
import './ProjectCard.css'

function ProjectCard({ project }) {
  const images = project.images || []
  const { openLightbox } = useLightbox()

  return (
    <div className="project-card reveal">

      {/* Left column — project title, plus an optional screenshot thumbnail below it */}
      <div className="project-left">
        <h3 className="project-title">{project.title}</h3>

        {images.length > 0 && (
          <button
            type="button"
            className="project-thumb"
            onClick={() => openLightbox(images, 0, project.title)}
            aria-label={`View screenshots of ${project.title}`}
          >
            <img src={images[0]} alt={`${project.title} screenshot`} loading="lazy" />
            {images.length > 1 && (
              <span className="project-thumb-count">{images.length} screenshots</span>
            )}
          </button>
        )}
      </div>

      {/* Center column — description, pills, and links all stacked */}
      <div className="project-center">
        <ul className="project-description">
          {project.description.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

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
          {project.docs && (
            <a href={project.docs} target="_blank" rel="noreferrer">Report</a>
          )}
        </div>
      </div>

    </div>
  )
}

export default ProjectCard
