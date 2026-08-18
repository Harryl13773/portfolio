import { useEffect, useState } from 'react'
import './ProjectCard.css'

function ProjectCard({ project }) {
  const images = project.images || []
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const closeLightbox = () => setLightboxIndex(null)
  const showPrev = (e) => {
    e.stopPropagation()
    setLightboxIndex((i) => (i - 1 + images.length) % images.length)
  }
  const showNext = (e) => {
    e.stopPropagation()
    setLightboxIndex((i) => (i + 1) % images.length)
  }

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i - 1 + images.length) % images.length)
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i + 1) % images.length)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightboxIndex, images.length])

  return (
    <div className="project-card reveal">

      {/* Left column — project title, plus an optional screenshot thumbnail below it */}
      <div className="project-left">
        <h3 className="project-title">{project.title}</h3>

        {images.length > 0 && (
          <button
            type="button"
            className="project-thumb"
            onClick={() => setLightboxIndex(0)}
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

      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button type="button" className="lightbox-close" onClick={closeLightbox} aria-label="Close">×</button>
          {images.length > 1 && (
            <button type="button" className="lightbox-nav lightbox-prev" onClick={showPrev} aria-label="Previous screenshot">‹</button>
          )}
          <img
            className="lightbox-image"
            src={images[lightboxIndex]}
            alt={`${project.title} screenshot ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <button type="button" className="lightbox-nav lightbox-next" onClick={showNext} aria-label="Next screenshot">›</button>
          )}
        </div>
      )}

    </div>
  )
}

export default ProjectCard