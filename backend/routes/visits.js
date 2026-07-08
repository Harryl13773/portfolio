const express = require('express');
const rateLimit = require('express-rate-limit');
const { configured, redis } = require('../lib/redis');

const router = express.Router();

// Day bucket key in Eastern time, formatted YYYY-MM-DD
function todayKey() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
  }).format(new Date());
}

// Rate limiter for the visit beacon (frontend only fires once per browser session)
const visitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/visit — fire-and-forget beacon from the frontend
router.post('/visit', visitLimiter, async (req, res) => {
  if (configured) {
    try {
      await redis([
        ['INCR', 'visits:total'],
        ['HINCRBY', 'visits:daily', todayKey(), 1],
      ]);
    } catch (err) {
      console.error('Visit count failed:', err.message);
    }
  }
  res.status(204).end();
});

// Rate limiter for the stats endpoint
const statsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

// GET /api/visits — public totals; daily breakdown requires "Authorization: Bearer <STATS_TOKEN>"
router.get('/visits', statsLimiter, async (req, res) => {
  if (!configured) {
    return res.status(503).json({ error: 'Visit tracking not configured' });
  }

  const statsToken = process.env.STATS_TOKEN;
  const isOwner =
    Boolean(statsToken) && req.get('authorization') === `Bearer ${statsToken}`;

  try {
    const [totalRes, dailyRes] = await redis([
      ['GET', 'visits:total'],
      ['HGETALL', 'visits:daily'],
    ]);

    // HGETALL comes back flat: [field, value, field, value, ...]
    const flat = dailyRes.result || [];
    const daily = {};
    for (let i = 0; i < flat.length; i += 2) {
      daily[flat[i]] = Number(flat[i + 1]);
    }

    const payload = {
      total: Number(totalRes.result || 0),
      today: daily[todayKey()] || 0,
    };
    if (isOwner) payload.daily = daily;

    res.json(payload);
  } catch (err) {
    console.error('Visit stats failed:', err.message);
    res.status(502).json({ error: 'Visit stats unavailable' });
  }
});

module.exports = router;