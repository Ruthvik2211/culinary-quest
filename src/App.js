import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'; // Make sure path is correct
import Home from './components/Home'; // Assuming you have this component
import BlogList from './components/BlogList';
import CreateBlog from './components/CreateBlog';
import SignIn from './components/SignIn'; // Assuming you have these auth components
import SignUp from './components/SignUp';
import ViewProfile from './components/ViewProfile';
import UpdateProfile from './components/UpdateProfile';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { fetchBlogPosts, createBlogPost } from './services/api'; // Changed from fetchUserBlogPosts to fetchBlogPosts

function App() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const loadBlogPosts = async () => {
      if (userInfo) { // Only fetch blog posts if user is logged in
        try {
          setLoading(true);
          const data = await fetchBlogPosts(); // Changed from fetchUserBlogPosts
          setBlogPosts(data);
        } catch (error) {
          console.error('Error loading blog posts:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadBlogPosts();
  }, [userInfo]); // Re-fetch when userInfo changes (login/logout)

  const addBlogPost = async (newPost) => {
    try {
      const createdPost = await createBlogPost(newPost);
      setBlogPosts([createdPost, ...blogPosts]);
      return createdPost;
    } catch (error) {
      console.error('Error adding blog post:', error);
      throw error;
    }
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!userInfo) {
      return <Navigate to="/signin" />;
    }
    return children;
  };

  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-16"> {/* Add padding top to account for fixed navbar */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Protected routes */}
            <Route path="/blogs" element={
              <ProtectedRoute>
                <BlogList 
                  blogPosts={blogPosts} 
                  loading={loading} 
                  setBlogPosts={setBlogPosts} 
                />
              </ProtectedRoute>
            } />
            
            <Route path="/create-blog" element={
              <ProtectedRoute>
                <CreateBlog addBlogPost={addBlogPost} />
              </ProtectedRoute>
            } />
            
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
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// Wrap the exported component with AuthProvider
const AppWithAuth = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuth;