import { useState } from 'react';
import './Contact.css';

// "company" is the honeypot — hidden from humans, tempting to bots
const INITIAL_FORM = { name: '', email: '', message: '', company: '' };

// comes from .env files: localhost in dev, your Render URL in production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setStatus('success');
      setForm(INITIAL_FORM);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <section id="contact" className="contact reveal">
      <span className="section-eyebrow">Contact</span>
      <h2 className="contact-heading">Get In Touch</h2>
      <p className="contact-subtext">
        Have a question or want to work together? Send a message.
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        {/* Honeypot integration */}
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
            rows={6}
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
    </section>
  );
}

export default Contact;