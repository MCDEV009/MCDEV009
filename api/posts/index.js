const { getDb } = require('../db');
const { authenticateToken } = require('../auth');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authResult = authenticateToken(req);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  const db = getDb();

  if (req.method === 'GET') {
    return new Promise((resolve) => {
      db.all(
        `SELECT p.*, u.username 
         FROM posts p 
         JOIN users u ON p.user_id = u.id 
         ORDER BY p.created_at DESC`,
        [],
        (err, posts) => {
          if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: 'Database error' });
            return resolve();
          }
          res.json(posts);
          resolve();
        }
      );
    });
  }

  if (req.method === 'POST') {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    return new Promise((resolve) => {
      db.run(
        'INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)',
        [title, content, authResult.user.id],
        function(err) {
          if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: 'Database error' });
            return resolve();
          }

          db.get(
            `SELECT p.*, u.username 
             FROM posts p 
             JOIN users u ON p.user_id = u.id 
             WHERE p.id = ?`,
            [this.lastID],
            (err, post) => {
              if (err) {
                console.error('Database error:', err);
                res.status(500).json({ error: 'Database error' });
                return resolve();
              }
              res.status(201).json(post);
              resolve();
            }
          );
        }
      );
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

