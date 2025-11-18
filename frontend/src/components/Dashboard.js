import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { removeToken } from '../utils/auth';
import PostList from './PostList';
import PostForm from './PostForm';
import './Dashboard.css';

function Dashboard({ setIsAuthenticated }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/me');
      setUser(response.data);
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleCreatePost = () => {
    setEditingPost(null);
    setShowForm(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handlePostSaved = () => {
    setShowForm(false);
    setEditingPost(null);
    fetchPosts();
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${id}`);
        fetchPosts();
      } catch (err) {
        alert(err.response?.data?.error || 'Failed to delete post');
      }
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Full Access Site</h1>
            {user && (
              <p className="user-info">
                Welcome, <strong>{user.username}</strong> ({user.email})
              </p>
            )}
          </div>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="posts-header">
            <h2>Posts</h2>
            <button onClick={handleCreatePost} className="create-button">
              + Create New Post
            </button>
          </div>

          {showForm && (
            <PostForm
              post={editingPost}
              onSave={handlePostSaved}
              onCancel={() => {
                setShowForm(false);
                setEditingPost(null);
              }}
            />
          )}

          {loading ? (
            <div className="loading">Loading posts...</div>
          ) : (
            <PostList
              posts={posts}
              currentUserId={user?.id}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

