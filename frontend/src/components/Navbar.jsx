import { useEffect, useRef, useState } from 'react';
import './Navbar.css';

// my resume
import resumePdf from '../assets/resume.pdf';

const LINKS = [
  { label: 'About', target: 'about' },
  { label: 'Experience', target: 'experience' },
  { label: 'Projects', target: 'projects' },
  { label: 'Contact', target: 'contact' },
];

// Applies a theme to the DOM (html attribute + browser-chrome color); shared by the toggle and the system listener
function applyThemeDom(next) {
  if (next === 'light') {
    document.documentElement.dataset.theme = 'light';
  } else {
    delete document.documentElement.dataset.theme;
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', next === 'light' ? '#e5e4e2' : '#0a0a0a');
  }
}

function Navbar() {
  const [activeSection, setActiveSection] = useState('about');
  const progressRef = useRef(null);

  // State mirrors <html data-theme>, already set pre-paint by the index.html script
  const [theme, setTheme] = useState(() =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
  );

  // Manual toggle: applies and persists, overriding the machine preference from then on
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyThemeDom(next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      // storage unavailable — theme still applies for this visit
    }
  };

  // Follows the machine live (e.g. OS auto day/night switch) as long as the user hasn't toggled manually
  useEffect(() => {
    applyThemeDom(
      document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
    ); // syncs the theme-color meta with the pre-paint pick

    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (e) => {
      let stored = null;
      try {
        stored = localStorage.getItem('theme');
      } catch {
        // storage unavailable — treat as no override
      }
      if (stored) return;
      const next = e.matches ? 'light' : 'dark';
      setTheme(next);
      applyThemeDom(next);
    };

    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Thin beam along the top edge tracking scroll progress
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? doc.scrollTop / max : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

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
      <div className="scroll-progress" aria-hidden="true" ref={progressRef} />

      <button
        className="navbar-name"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Harry L.
      </button>

      <div className="top-right">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={
            theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
          }
        >
          {theme === 'dark' ? (
            /* sun — shows what clicking switches to */
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4.2" />
              <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M18.7 5.3L17 7M7 17l-1.7 1.7" />
            </svg>
          ) : (
            /* moon */
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
            </svg>
          )}
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
      </div>

      <nav className="side-nav" aria-label="Section navigation">
        <ul className="side-nav-links">
          {LINKS.map((link, i) => (
            <li key={link.target}>
              <button
                className={
                  'side-nav-link' +
                  (activeSection === link.target ? ' side-nav-link-active' : '')
                }
                onClick={() => scrollTo(link.target)}
              >
                <span className="side-nav-index" aria-hidden="true">
                  0{i + 1}
                </span>
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