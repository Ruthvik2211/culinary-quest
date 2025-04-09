import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import NotFound from './components/NotFound';
import BlogList from './components/BlogList';
import CreateBlog from './components/CreateBlog';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ViewProfile from './components/ViewProfile';
import UpdateProfile from './components/UpdateProfile';
import './index.css';
import Navbar from './components/Navbar';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { fetchBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from './services/api';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { userInfo, loading } = React.useContext(AuthContext);
  
  if (loading) {
    return <div className="pt-20 text-center">Loading...</div>;
  }
  
  if (!userInfo) {
    return <Navigate to="/signin" />;
  }
  
  return children;
};

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
      return savedPost;
    } catch (error) {
      console.error('Failed to add blog post', error);
      throw error;
    }
  };

  const editBlogPost = async (id, updatedPost) => {
    try {
      const result = await updateBlogPost(id, updatedPost);
      setBlogPosts(blogPosts.map(post => post._id === id ? result : post));
      return result;
    } catch (error) {
      console.error(`Failed to update blog post with ID: ${id}`, error);
      throw error;
    }
  };

  const removeBlogPost = async (id) => {
    try {
      await deleteBlogPost(id);
      setBlogPosts(blogPosts.filter(post => post._id !== id));
    } catch (error) {
      console.error(`Failed to delete blog post with ID: ${id}`, error);
      throw error;
    }
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
          <Navbar />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/blogs" 
                element={
                  <BlogList 
                    blogPosts={blogPosts} 
                    loading={loading} 
                    setBlogPosts={setBlogPosts}
                  />
                } 
              />
              <Route 
                path="/create-blog" 
                element={
                  <ProtectedRoute>
                    <CreateBlog addBlogPost={addBlogPost} />
                  </ProtectedRoute>
                } 
              />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ViewProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/update-profile" 
                element={
                  <ProtectedRoute>
                    <UpdateProfile />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;