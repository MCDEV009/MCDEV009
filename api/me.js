const { getDb } = require('./db');
const { authenticateToken } = require('./auth');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authResult = authenticateToken(req);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  const db = getDb();

  return new Promise((resolve) => {
    db.get(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [authResult.user.id],
      (err, user) => {
        if (err) {
          console.error('Database error:', err);
          res.status(500).json({ error: 'Database error' });
          return resolve();
        }
        if (!user) {
          res.status(404).json({ error: 'User not found' });
          return resolve();
        }
        res.json(user);
        resolve();
      }
    );
  });
};

