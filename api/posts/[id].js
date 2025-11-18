const { getDb } = require('../db');
const { authenticateToken } = require('../auth');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authResult = authenticateToken(req);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  const db = getDb();
  // Extract ID from URL path (e.g., /api/posts/123)
  // Handle both /api/posts/123 and /api/posts/123?query=params
  let postId = req.query.id;
  if (!postId) {
    const urlParts = req.url.split('?')[0].split('/');
    postId = urlParts[urlParts.length - 1];
  }
  
  if (!postId || isNaN(postId)) {
    return res.status(400).json({ error: 'Invalid post ID' });
  }

  if (req.method === 'GET') {
    return new Promise((resolve) => {
      db.get(
        `SELECT p.*, u.username 
         FROM posts p 
         JOIN users u ON p.user_id = u.id 
         WHERE p.id = ?`,
        [postId],
        (err, post) => {
          if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: 'Database error' });
            return resolve();
          }
          if (!post) {
            res.status(404).json({ error: 'Post not found' });
            return resolve();
          }
          res.json(post);
          resolve();
        }
      );
    });
  }

  if (req.method === 'PUT') {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    return new Promise((resolve) => {
      // Check if post exists and belongs to user
      db.get('SELECT * FROM posts WHERE id = ?', [postId], (err, post) => {
        if (err) {
          console.error('Database error:', err);
          res.status(500).json({ error: 'Database error' });
          return resolve();
        }
        if (!post) {
          res.status(404).json({ error: 'Post not found' });
          return resolve();
        }
        if (post.user_id !== authResult.user.id) {
          res.status(403).json({ error: 'Not authorized to update this post' });
          return resolve();
        }

        db.run(
          'UPDATE posts SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [title, content, postId],
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
              [postId],
              (err, post) => {
                if (err) {
                  console.error('Database error:', err);
                  res.status(500).json({ error: 'Database error' });
                  return resolve();
                }
                res.json(post);
                resolve();
              }
            );
          }
        );
      });
    });
  }

  if (req.method === 'DELETE') {
    return new Promise((resolve) => {
      // Check if post exists and belongs to user
      db.get('SELECT * FROM posts WHERE id = ?', [postId], (err, post) => {
        if (err) {
          console.error('Database error:', err);
          res.status(500).json({ error: 'Database error' });
          return resolve();
        }
        if (!post) {
          res.status(404).json({ error: 'Post not found' });
          return resolve();
        }
        if (post.user_id !== authResult.user.id) {
          res.status(403).json({ error: 'Not authorized to delete this post' });
          return resolve();
        }

        db.run('DELETE FROM posts WHERE id = ?', [postId], function(err) {
          if (err) {
            console.error('Database error:', err);
            res.status(500).json({ error: 'Database error' });
            return resolve();
          }
          res.json({ message: 'Post deleted successfully' });
          resolve();
        });
      });
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

