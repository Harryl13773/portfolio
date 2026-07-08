// Shared Upstash Redis REST helper (used by visits + contact routes)
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

module.exports = { configured, redis };
