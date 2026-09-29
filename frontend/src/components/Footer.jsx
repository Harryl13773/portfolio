import { useEffect, useState } from 'react';
import './Footer.css';

import { version } from '../../package.json';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function Footer() {
  const [visits, setVisits] = useState(null);

  // Fetch the total visit count
  useEffect(() => {
    fetch(`${API_URL}/api/visits`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.total === 'number') setVisits(data.total);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="footer">
      <p className="footer-hint">
        <span className="footer-hint-keys">Use ← → or 1–4 to switch sections</span>
        <span className="footer-hint-touch">Swipe to switch sections</span>
      </p>
      <p className="footer-meta">
        <span>© {new Date().getFullYear()} Harry Lian</span>
        <a className="footer-link" href="/privacy.html">Privacy</a>
        <span aria-hidden="true">
          v{version}
          {visits !== null && `, ${visits.toLocaleString()} visits`}
        </span>
      </p>
    </footer>
  );
}

export default Footer;
