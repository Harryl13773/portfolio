const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// declare variables
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const configured = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

// Runs an array of Redis commands in one HTTP round trip
async function redis(commands) {
  const res = await fetch(`${UPSTASH_URL}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
  });
  if (!res.ok) {
    throw new Error(`Upstash responded ${res.status}`);
  }
  return res.json(); // -> [{ result: ... }, ...] in command order
}

// Day buckets in Eastern time (site owner's timezone), formatted YYYY-MM-DD
function todayKey() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
  }).format(new Date());
}

// Generous limit — the frontend only beacons once per browser session
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

// GET /api/visits — totals for display / checking the numbers
router.get('/visits', async (req, res) => {
  if (!configured) {
    return res.status(503).json({ error: 'Visit tracking not configured' });
  }

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

    res.json({
      total: Number(totalRes.result || 0),
      today: daily[todayKey()] || 0,
      daily,
    });
  } catch (err) {
    console.error('Visit stats failed:', err.message);
    res.status(502).json({ error: 'Visit stats unavailable' });
  }
});

module.exports = router;