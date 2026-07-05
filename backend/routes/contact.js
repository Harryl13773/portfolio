const express = require('express');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const MESSAGES_FILE = path.join(__dirname, '..', 'data', 'messages.json');

// Basic email shape check (not exhaustive, just sanity)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- Rate limiter: max 5 submissions per IP per hour ---
// This runs BEFORE the route handler. Requests over the limit
// get a 429 response and never reach our code at all.
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true, // adds RateLimit-* headers to responses
  legacyHeaders: false,
  message: {
    error: 'Too many messages from this address. Please try again in an hour.',
  },
});

// POST /api/contact
router.post('/', contactLimiter, (req, res) => {
  const { name, email, message, company } = req.body || {};

  // --- Honeypot check ---
  // "company" is a hidden field real users never see or fill.
  // If it arrives with content, this is a bot. We return a fake
  // success so the bot thinks it worked and doesn't adapt.
  if (company) {
    console.log('Honeypot triggered — dropping bot submission.');
    return res.status(201).json({ success: true });
  }

  // --- Validation ---
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: 'Name, email, and message are all required.' });
  }

  if (typeof name !== 'string' || name.trim().length > 100) {
    return res.status(400).json({ error: 'Name must be 100 characters or fewer.' });
  }

  if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  if (
    typeof message !== 'string' ||
    message.trim().length < 10 ||
    message.trim().length > 2000
  ) {
    return res
      .status(400)
      .json({ error: 'Message must be between 10 and 2000 characters.' });
  }

  // --- Save the message ---
  const newMessage = {
    id: Date.now(),
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    receivedAt: new Date().toISOString(),
  };

  try {
    let messages = [];
    if (fs.existsSync(MESSAGES_FILE)) {
      messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
    }
    messages.push(newMessage);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
  } catch (err) {
    console.error('Failed to save contact message:', err);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }

  console.log(`New contact message from ${newMessage.name} <${newMessage.email}>`);
  return res.status(201).json({ success: true });
});

module.exports = router;