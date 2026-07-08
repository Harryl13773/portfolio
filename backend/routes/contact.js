const express = require('express');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const { configured: redisConfigured, redis } = require('../lib/redis');

const router = express.Router();

// Local-dev fallback storage for contact messages
const MESSAGES_FILE = path.join(__dirname, '..', 'data', 'messages.json');

// Basic email shape check
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limiter: max 5 submissions per IP per hour
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many messages from this address. Please try again in an hour.',
  },
});

// Escape user input before it goes into email HTML
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Send the owner a notification email via Resend's HTTP API
async function sendNotificationEmail({ name, email, message }) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  // Skip silently when email isn't configured (local dev)
  if (!apiKey || !toEmail) {
    console.log('Email not configured (RESEND_API_KEY / CONTACT_TO_EMAIL missing) — skipping notification.');
    return;
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [toEmail],
      reply_to: email, // "Reply" in the inbox goes to the sender
      subject: `Portfolio message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `
        <h2>New portfolio message</h2>
        <p><strong>From:</strong> ${safeName} &lt;${safeEmail}&gt;</p>
        <p style="white-space:pre-wrap;border-left:3px solid #c084fc;padding-left:12px;">${safeMessage}</p>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend API responded ${res.status}: ${body}`);
  }
}

// POST /api/contact — validate, save, and email a contact form submission
router.post('/', contactLimiter, async (req, res) => {
  const { name, email, message, company } = req.body || {};

  // Honeypot check — bots fill the hidden "company" field, humans never see it
  if (company) {
    console.log('Honeypot triggered — dropping bot submission.');
    return res.status(201).json({ success: true });
  }

  // Validate presence, types, and lengths
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

  // Build the message record (newlines stripped from name so it's safe in the email subject)
  const newMessage = {
    id: Date.now(),
    name: name.trim().replace(/[\r\n]+/g, ' '),
    email: email.trim(),
    message: message.trim(),
    receivedAt: new Date().toISOString(),
  };

  // Save to Redis in production (host disk is wiped on deploy); local JSON file otherwise
  try {
    if (redisConfigured) {
      await redis([['RPUSH', 'contact:messages', JSON.stringify(newMessage)]]);
    } else {
      let messages = [];
      if (fs.existsSync(MESSAGES_FILE)) {
        messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
      }
      messages.push(newMessage);
      fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
    }
  } catch (err) {
    console.error('Failed to save contact message:', err);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }

  // Email failures are only logged — the message is already saved
  try {
    await sendNotificationEmail(newMessage);
    console.log(`Notification email sent for message from ${newMessage.name}.`);
  } catch (err) {
    console.error('Email notification failed (message is still saved):', err.message);
  }

  return res.status(201).json({ success: true });
});

module.exports = router;
