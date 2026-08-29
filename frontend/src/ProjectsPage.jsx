import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import ProjectCard from './components/ProjectCard';
import Footer from './components/Footer';
import { handleNavClick } from './lib/navigate';
import './ProjectsPage.css';

// API base URL: localhost in dev, Render URL in production builds
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'All Projects — Harry Lian';
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/projects`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load projects.');
        return res.json();
      })
      .then((data) => setProjects(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Reveal cards as the user scrolls, same as the homepage projects grid
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loading]);

  return (
    <div className="app">
      <Navbar page="projects" />

      <main className="app-main">
        <section className="projects-section all-projects-section">
          <a
            href="/"
            className="all-projects-back"
            onClick={(e) => handleNavClick(e, '/')}
          >
            ← Back to home
          </a>

          <span className="section-eyebrow">Projects</span>
          <h2 className="projects-heading">All Projects</h2>
          {error && <p className="projects-message">{error}</p>}
          <div className="projects-grid">
            {loading &&
              [1, 2, 3].map((n) => (
                <div key={n} className="project-card project-card-skeleton" aria-hidden="true">
                  <div className="project-left">
                    <div className="skeleton-line skeleton-title" />
                  </div>
                  <div className="project-center">
                    <div className="skeleton-line" />
                    <div className="skeleton-line skeleton-short" />
                    <div className="skeleton-pills">
                      <div className="skeleton-pill" />
                      <div className="skeleton-pill" />
                      <div className="skeleton-pill" />
                    </div>
                  </div>
                </div>
              ))}
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default ProjectsPage;
