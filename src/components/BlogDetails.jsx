// src/components/BlogDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBlogPostById } from '../services/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        const data = await getBlogPostById(id);
        setBlog(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch blog details. Please try again later.');
        console.error('Error fetching blog details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  // Create HTML markup from the content
  const createMarkup = (content) => {
    return { __html: content };
  };

  // Function to handle going back
  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex justify-center items-center py-20">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'Blog post not found.'}</p>
          <button 
            onClick={handleGoBack}
            className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isAuthor = userInfo && userInfo._id === blog.author;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-20 px-4">
      <div className="max-w-4xl mx-auto pt-16">
        {/* Back button */}
        <button 
          onClick={handleGoBack}
          className="flex items-center text-orange-600 hover:text-orange-700 mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
        
        {/* Blog post content */}
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            {/* Category badge */}
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-600">
                {blog.category}
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">{blog.title}</h1>
            
            {/* Author info and date */}
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                <span className="text-orange-600 font-semibold">
                  {blog.authorName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-sm text-gray-600">{blog.authorName}</h3>
                <p className="text-xs text-gray-500">
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              {/* Edit button for author */}
              {isAuthor && (
                <Link 
                  to={`/edit-blog/${blog._id}`}
                  className="ml-auto bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
                >
                  Edit Post
                </Link>
              )}
            </div>
            
            {/* Video content if available */}
            {blog.videoUrl && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Video Tutorial</h3>
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                  <iframe
                    src={blog.videoUrl}
                    title="Recipe Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            )}
            
            {/* Main content */}
            <div className="prose prose-orange max-w-none mb-8">
              <div dangerouslySetInnerHTML={createMarkup(blog.content)} />
            </div>
            
            {/* Author advice if available */}
            {blog.authorAdvice && (
              <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500 mb-6">
                <h3 className="text-lg font-semibold text-orange-700 mb-2">Chef's Notes</h3>
                <p className="italic text-gray-700">{blog.authorAdvice}</p>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetails;