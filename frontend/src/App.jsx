import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import About from './components/About';
import ProjectCard from './components/ProjectCard';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Experience from './components/Experience';
import './App.css';

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/projects')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load projects.');
        return res.json();
      })
      .then((data) => setProjects(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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
          <h2 className="projects-heading">Projects</h2>
          {loading && <p className="projects-message">Loading projects…</p>}
          {error && <p className="projects-message">{error}</p>}
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>

        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;