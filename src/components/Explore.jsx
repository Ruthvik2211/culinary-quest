// src/components/Explore.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPublicBlogPosts } from '../services/api';

const Explore = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Categories for filtering
  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snacks', 'Beverages'];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await getAllPublicBlogPosts();
        setBlogs(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch blog posts. Please try again later.');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter blogs based on search term and category
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          blog.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || selectedCategory === '' || 
                           blog.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Truncate text to a specific length
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Extract a brief preview from the content
  const getContentPreview = (content) => {
    // Remove any HTML tags for the preview
    const textContent = content.replace(/<[^>]*>/g, '');
    return truncateText(textContent, 150);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-20 px-4">
      <div className="max-w-7xl mx-auto pt-16">
        <h1 className="text-4xl font-bold text-center mb-10 text-orange-600">Explore Culinary Adventures</h1>
        
        {/* Search and filter section */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search blogs by title, content, or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="w-full md:w-1/3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Error and loading states */}
        {error && (
          <div className="text-center p-4 mb-6 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            {/* Results count */}
            <p className="text-gray-600 mb-6">
              Showing {filteredBlogs.length} {filteredBlogs.length === 1 ? 'result' : 'results'}
            </p>
            
            {/* Blog cards grid */}
            {filteredBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map((blog) => (
                  <Link to={`/blog/${blog._id}`} key={blog._id} className="hover:no-underline">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="p-6">
                        <div className="flex items-center mb-4">
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
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <span className="inline-block px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-600 mb-4">
                          {blog.category}
                        </span>
                        
                        <h2 className="text-xl font-bold mb-3 text-gray-800">{blog.title}</h2>
                        <p className="text-gray-600 mb-4">{getContentPreview(blog.content)}</p>
                        
                        {blog.videoUrl && (
                          <div className="mb-4">
                            <span className="text-xs text-orange-600 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Includes video
                            </span>
                          </div>
                        )}
                        
                        <div className="mt-4 text-right">
                          <span className="text-orange-500 font-medium hover:text-orange-600">
                            Read more →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center p-10 bg-white rounded-lg shadow">
                <h3 className="text-xl text-gray-700 mb-2">No blog posts found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;