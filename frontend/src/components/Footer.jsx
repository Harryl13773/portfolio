import './Footer.css';

// Fill these in with your real links
const EMAIL = 'lian.000155@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/harry-lian/';
const GITHUB = 'https://github.com/Harryl13773';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a className="footer-link" href={`mailto:${EMAIL}`}>
          <svg
            className="footer-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
            <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
          </svg>
          Email
        </a>

        <a
          className="footer-link"
          href={LINKEDIN}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            className="footer-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7.5 0h3.8v2.05h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V23h-4v-7.9c0-1.88-.03-4.3-2.62-4.3-2.62 0-3.02 2.05-3.02 4.16V23H8V8z" />
          </svg>
          LinkedIn
        </a>

        <a
          className="footer-link"
          href={GITHUB}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            className="footer-icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.03 11.03 0 0 1 5.78 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.26 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.66.8.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
          </svg>
          GitHub
        </a>
      </div>

      <p className="footer-note">
        © {new Date().getFullYear()} Harry Lian · Built with React &amp; Express
      </p>
    </footer>
  );
}

export default Footer;