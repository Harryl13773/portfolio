import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import About from './components/About';
import ProjectCard from './components/ProjectCard';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Experience from './components/Experience';
import './App.css';

// Comes from .env files: localhost in dev, your Render URL in production
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

  //revealing sections as users scroll
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
          {loading && <p className="projects-message">Loading projects…</p>}
          {error && <p className="projects-message">{error}</p>}
          <div className="projects-grid">
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