import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import NotFound from './components/NotFound';
import BlogList from './components/BlogList';
import CreateBlog from './components/CreateBlog';
import './index.css';
import Navbar from './components/Navbar';
import { fetchBlogPosts, createBlogPost } from './services/api';

function App() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        const posts = await fetchBlogPosts();
        setBlogPosts(posts);
      } catch (error) {
        console.error('Failed to load blog posts', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadBlogPosts();
  }, []);
  
  const addBlogPost = async (newPost) => {
    try {
      const savedPost = await createBlogPost(newPost);
      setBlogPosts([savedPost, ...blogPosts]);
    } catch (error) {
      console.error('Failed to add blog post', error);
    }
  };
  
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <Navbar />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<BlogList blogPosts={blogPosts} loading={loading} />} />
            <Route path="/create-blog" element={<CreateBlog addBlogPost={addBlogPost} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;