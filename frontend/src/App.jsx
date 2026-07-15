import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import About from './components/About';
import ProjectCard from './components/ProjectCard';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Experience from './components/Experience';
import './App.css';

// API base URL: localhost in dev, Render URL in production builds
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Count one visit per browser session (production builds only)
  useEffect(() => {
    if (!import.meta.env.PROD) return;
    if (sessionStorage.getItem('visit-counted')) return;
    sessionStorage.setItem('visit-counted', '1');
    fetch(`${API_URL}/api/visit`, { method: 'POST' }).catch(() => {});
  }, []);

  // Reveal sections as the user scrolls
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
      <Navbar />

      {/* Offset content below the fixed navbar */}
      <main className="app-main">
        <section id="about">
          <About />
        </section>

        <section id="experience">
          <Experience />
        </section>

        <section id="projects" className="projects-section">
          <span className="section-eyebrow reveal">Projects</span>
          <h2 className="projects-heading reveal">Selected Work</h2>
          {error && <p className="projects-message">{error}</p>}
          <div className="projects-grid">
            {loading &&
              // Skeleton placeholders sized like real cards, so the Render cold start (~50s) shows structure instead of a blank gap
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

        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;