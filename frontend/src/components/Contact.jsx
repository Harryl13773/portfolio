import { useState } from 'react';
import './Contact.css';

// Empty form state; "company" is the honeypot
const INITIAL_FORM = { name: '', email: '', message: '', company: '' };

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const EMAIL = 'lian.000155@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/harry-lian/';
const GITHUB = 'https://github.com/Harryl13773';
const INSTAGRAM = 'https://www.instagram.com/harry_l215/';
const INSTAGRAM_HANDLE = INSTAGRAM.split('/').filter(Boolean).pop();

function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      // Error responses may not be JSON
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setStatus('success');
      setForm(INITIAL_FORM);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="split contact">
      <div>
        <p className="contact-intro">
          Have a question or want to work together? Send a message, or reach me directly.
        </p>
        <dl className="contact-direct">
          <div>
            <dt>Email</dt>
            <dd><a className="text-link" href={`mailto:${EMAIL}`}>{EMAIL}</a></dd>
          </div>
          <div>
            <dt>LinkedIn</dt>
            <dd><a className="text-link" href={LINKEDIN} target="_blank" rel="noopener noreferrer">harry-lian</a></dd>
          </div>
          <div>
            <dt>GitHub</dt>
            <dd><a className="text-link" href={GITHUB} target="_blank" rel="noopener noreferrer">Harryl13773</a></dd>
          </div>
          <div>
            <dt>Instagram</dt>
            <dd><a className="text-link" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">{INSTAGRAM_HANDLE}</a></dd>
          </div>
        </dl>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        {/* Honeypot field */}
        <label className="contact-honeypot" aria-hidden="true">
          Company
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>

        <label className="contact-label">
          Name
          <input
            className="contact-input"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            maxLength={100}
          />
        </label>

        <label className="contact-label">
          Email
          <input
            className="contact-input"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            maxLength={150}
          />
        </label>

        <label className="contact-label">
          Message
          <textarea
            className="contact-input contact-textarea"
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            minLength={10}
            maxLength={2000}
            rows={4}
          />
        </label>

        <button
          className="contact-submit"
          type="submit"
          disabled={status === 'sending'}
        >
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>

        {status === 'success' && (
          <p className="contact-status contact-status-success">
            Message sent. I&apos;ll get back to you soon.
          </p>
        )}
        {status === 'error' && (
          <p className="contact-status contact-status-error">{errorMsg}</p>
        )}
      </form>
    </div>
  );
}

export default Contact;