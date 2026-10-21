import { useState } from 'react';
import { useLightbox } from '../lib/lightbox-context';
import projects from '../data/projects.json';
import './Projects.css';

const MAX_THUMBS = 4;

function Projects() {
  const [selectedId, setSelectedId] = useState(null);
  const { openLightbox } = useLightbox();

  const project = projects.find((p) => p.id === selectedId) || projects[0];
  if (!project) return <p className="projects-message">No projects yet.</p>;

  const images = project.images || [];
  const links = [
    project.github && { href: project.github, label: 'GitHub' },
    project.live && { href: project.live, label: 'Live demo' },
    project.docs && { href: project.docs, label: 'Write-up' },
  ].filter(Boolean);

  return (
    <div className="split projects">
      <ul className="picker">
        {projects.map((p) => (
          <li key={p.id}>
            <button
              className="picker-item"
              aria-pressed={p.id === project.id}
              onClick={() => setSelectedId(p.id)}
            >
              <span className="picker-title">{p.title}</span>
              <span className="picker-meta">{p.tech.slice(0, 3).join(', ')}</span>
            </button>
          </li>
        ))}
      </ul>

      <article key={project.id} className="project-detail" aria-live="polite">
        <h2 className="detail-title">{project.title}</h2>

        <ul className="detail-points">
          {project.description.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        <p className="detail-tech">
          <strong>Built with</strong> {project.tech.join(', ')}
        </p>

        {links.length > 0 && (
          <p className="project-links">
            {links.map((link) => (
              <a key={link.label} className="text-link" href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </p>
        )}

        {images.length > 0 && (
          <div className="project-thumbs">
            {images.slice(0, MAX_THUMBS).map((src, i) => {
              const hidden = i === MAX_THUMBS - 1 ? images.length - MAX_THUMBS : 0;
              return (
                <button
                  key={src}
                  type="button"
                  className="project-thumb"
                  onClick={() => openLightbox(images, i, project.title)}
                  aria-label={`View screenshot ${i + 1} of ${images.length}`}
                >
                  <img src={src} alt="" loading="lazy" />
                  {hidden > 0 && <span className="project-thumb-more">+{hidden}</span>}
                </button>
              );
            })}
          </div>
        )}
      </article>
    </div>
  );
}

export default Projects;
