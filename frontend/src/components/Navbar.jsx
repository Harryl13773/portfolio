import { useEffect, useState } from 'react';
import './Navbar.css';
// Vite turns this import into a URL that works in dev and in the production build.
// Rename to match your actual file in src/assets/.
import resumePdf from '../assets/resume.pdf';

const LINKS = [
  { label: 'About', target: 'about' },
  { label: 'Projects', target: 'projects' },
  { label: 'Contact', target: 'contact' },
];

function Navbar() {
  const [activeSection, setActiveSection] = useState('about');

  // Watch which section is currently on screen and highlight its tab
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      // Fires when a section crosses the middle band of the viewport
      { rootMargin: '-40% 0px -55% 0px' }
    );

    LINKS.forEach((link) => {
      const el = document.getElementById(link.target);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <button
        className="navbar-name"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Harry L.
      </button>

      <a
        className="resume-button"
        href={resumePdf}
        target="_blank"
        rel="noopener noreferrer"
      >
        Resume
        <span className="resume-button-arrow" aria-hidden="true">↗</span>
      </a>

      <nav className="side-nav" aria-label="Section navigation">
        <ul className="side-nav-links">
          {LINKS.map((link) => (
            <li key={link.target}>
              <button
                className={
                  'side-nav-link' +
                  (activeSection === link.target ? ' side-nav-link-active' : '')
                }
                onClick={() => scrollTo(link.target)}
              >
                <span className="side-nav-indicator" aria-hidden="true" />
                <span className="side-nav-label">{link.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

export default Navbar;