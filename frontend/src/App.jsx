import { useCallback, useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useLightbox } from './lib/lightbox-context';
import './App.css';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const TABS = [
  { id: 'about', label: 'About', Panel: About },
  { id: 'experience', label: 'Experience', Panel: Experience },
  { id: 'projects', label: 'Projects', Panel: Projects },
  { id: 'contact', label: 'Contact', Panel: Contact },
];

// Reads the active tab from the URL
function tabFromLocation() {
  const hash = window.location.hash.slice(1);
  if (TABS.some((t) => t.id === hash)) return hash;
  if (window.location.pathname === '/projects') return 'projects';
  return 'about';
}

// Builds the URL for a tab
function urlFor(id) {
  return id === 'about' ? '/' : `/#${id}`;
}

function App() {
  const [active, setActive] = useState(tabFromLocation);
  const [direction, setDirection] = useState(1); // Panel slide direction
  const { isLightboxOpen } = useLightbox();
  const tabRefs = useRef({});

  // Normalize the URL on load
  useEffect(() => {
    window.history.replaceState({}, '', urlFor(tabFromLocation()));
  }, []);

  // Sync the tab with back/forward navigation
  useEffect(() => {
    const onPopState = () => setActive(tabFromLocation());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const select = useCallback(
    (id, { focus = false } = {}) => {
      if (id === active) return;
      const from = TABS.findIndex((t) => t.id === active);
      const to = TABS.findIndex((t) => t.id === id);
      setDirection(to > from ? 1 : -1);
      setActive(id);
      window.history.pushState({}, '', urlFor(id));
      if (focus) tabRefs.current[id]?.focus();
    },
    [active]
  );

  // Swipe left/right to switch tabs
  const touchStart = useRef(null);

  const onTouchStart = (e) => {
    const t = e.touches[0];
    const edge = 24; // Leave screen edges to the browser's back gesture
    const ignore =
      isLightboxOpen ||
      e.touches.length > 1 ||
      t.clientX < edge ||
      t.clientX > window.innerWidth - edge ||
      e.target.closest('.picker') ||
      (e.target === document.activeElement && e.target.matches('input, textarea')); // Ignore while typing in a field
    touchStart.current = ignore ? null : { x: t.clientX, y: t.clientY, time: Date.now() };
  };

  const onTouchEnd = (e) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    // Only accept quick, clearly horizontal swipes
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5 || Date.now() - start.time > 600) return;
    const i = TABS.findIndex((tab) => tab.id === active);
    const next = TABS[i + (dx < 0 ? 1 : -1)];
    if (next) select(next.id);
  };

  // Arrow and number keys switch tabs
  useEffect(() => {
    const onKeyDown = (e) => {
      if (isLightboxOpen || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;

      const i = TABS.findIndex((t) => t.id === active);
      const onTab = el?.getAttribute('role') === 'tab';
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        select(TABS[(i + 1) % TABS.length].id, { focus: onTab });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        select(TABS[(i - 1 + TABS.length) % TABS.length].id, { focus: onTab });
      } else if (/^[1-4]$/.test(e.key)) {
        select(TABS[Number(e.key) - 1].id, { focus: onTab });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active, select, isLightboxOpen]);

  // Count one visit per browser session (also wakes the API before a contact submit)
  useEffect(() => {
    if (!import.meta.env.PROD) return;
    if (sessionStorage.getItem('visit-counted')) return;
    sessionStorage.setItem('visit-counted', '1');
    fetch(`${API_URL}/api/visit`, { method: 'POST' }).catch(() => {});
  }, []);

  useEffect(() => {
    const label = TABS.find((t) => t.id === active).label;
    document.title = active === 'about' ? 'Harry Lian — Computer Engineer' : `${label} — Harry Lian`;
  }, [active]);

  const { Panel } = TABS.find((t) => t.id === active);

  return (
    <div className="app">
      <Navbar />

      <nav className="tabs" role="tablist" aria-label="Portfolio sections">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => (tabRefs.current[tab.id] = el)}
            id={`tab-${tab.id}`}
            role="tab"
            className="tab"
            aria-selected={active === tab.id}
            aria-controls="panel"
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => select(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main
        id="panel"
        className="panel"
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Remount on tab change to replay the entrance animation */}
        <div key={active} className="panel-inner" data-direction={direction}>
          <Panel />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
