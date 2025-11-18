import React from 'react';
import './PostList.css';

function PostList({ posts, currentUserId, onEdit, onDelete }) {
  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <p>No posts yet. Create your first post!</p>
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <div>
              <h3>{post.title}</h3>
              <p className="post-meta">
                By {post.username} • {new Date(post.created_at).toLocaleDateString()}
                {post.updated_at !== post.created_at && (
                  <span> • Updated {new Date(post.updated_at).toLocaleDateString()}</span>
                )}
              </p>
            </div>
            {post.user_id === currentUserId && (
              <div className="post-actions">
                <button
                  onClick={() => onEdit(post)}
                  className="edit-button"
                  title="Edit post"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(post.id)}
                  className="delete-button"
                  title="Delete post"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
          <div className="post-content">
            <p>{post.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PostList;

