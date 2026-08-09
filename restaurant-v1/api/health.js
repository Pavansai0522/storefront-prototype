/** Minimal route — no imports (Vercel-safe). */
module.exports = function handler(_req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: true, route: 'health' }));
};
