import { useEffect, useState } from 'react';
import './Navbar.css';

// Resume PDF
import resumePdf from '../assets/resume.pdf';

// Applies a theme to the page
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

// Top bar: name, theme toggle, and resume
function Navbar() {

  // Current theme, set before paint by index.html
  const [theme, setTheme] = useState(() =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
  );

  // Toggle and save the theme
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyThemeDom(next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Storage unavailable: apply for this visit only
    }
  };

  // Follow system theme changes unless the user chose one
  useEffect(() => {
    applyThemeDom(
      document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
    ); // Sync the theme-color meta

    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (e) => {
      let stored = null;
      try {
        stored = localStorage.getItem('theme');
      } catch {
        // Storage unavailable: no saved choice
      }
      if (stored) return;
      const next = e.matches ? 'light' : 'dark';
      setTheme(next);
      applyThemeDom(next);
    };

    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <header className="navbar">
      <span className="navbar-name">Harry Lian</span>

      <div className="top-right">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={
            theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
          }
        >
          {theme === 'dark' ? (
            /* Sun icon */
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
            /* Moon icon */
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
    </header>
  );
}

export default Navbar;
