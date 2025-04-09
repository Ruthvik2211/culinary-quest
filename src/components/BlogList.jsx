import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { updateBlogPost, deleteBlogPost } from '../services/api';
import '../index.css';

const BlogList = ({ blogPosts, loading, setBlogPosts }) => {
  const [editingPost, setEditingPost] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    content: '',
    category: '',
    videoUrl: '',
    authorAdvice: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to extract YouTube video ID from URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    
    // Match YouTube URL patterns
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    // If match and video ID is 11 characters (standard for YouTube)
    return (match && match[2].length === 11) 
      ? `https://www.youtube.com/embed/${match[2]}` 
      : null;
  };

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to start editing a post
  const handleEditClick = (post) => {
    setEditingPost(post._id);
    setEditFormData({
      title: post.title,
      content: post.content,
      category: post.category,
      videoUrl: post.videoUrl || '',
      authorAdvice: post.authorAdvice || ''
    });
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingPost(null);
    setEditFormData({
      title: '',
      content: '',
      category: '',
      videoUrl: '',
      authorAdvice: ''
    });
  };

  // Function to handle input changes in the edit form
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  // Function to save edited post
  const handleSaveEdit = async (postId) => {
    setIsSubmitting(true);
    try {
      const updatedPost = await updateBlogPost(postId, editFormData);
      
      // Update the blog posts state with the edited post
      setBlogPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? updatedPost : post
        )
      );
      
      // Exit edit mode
      setEditingPost(null);
    } catch (error) {
      console.error('Failed to update blog post:', error);
      alert('Failed to update blog post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle delete
  const handleDeleteClick = async (postId) => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        await deleteBlogPost(postId);
        
        // Remove the deleted post from the state
        setBlogPosts(prevPosts => 
          prevPosts.filter(post => post._id !== postId)
        );
      } catch (error) {
        console.error('Failed to delete blog post:', error);
        alert('Failed to delete blog post. Please try again.');
      }
    }
  };

  // Function to validate YouTube URL format
  const isValidYouTubeUrl = (url) => {
    if (!url) return true; // Empty URL is valid (optional field)
    
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
    return youtubeRegex.test(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
          Culinary Quest Blog
        </h1>
        
        {/* Create New Blog Button */}
        <div className="mb-8 text-center">
          <Link 
            to="/create-blog" 
            className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 text-lg font-bold rounded-lg shadow-lg hover:shadow-xl text-white transform hover:translate-y-px transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Blog
          </Link>
        </div>
        
        {/* Blog Posts List */}
        {loading ? (
          <div className="bg-white shadow-2xl rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center space-x-2 text-yellow-600">
              <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-xl font-semibold">Loading blog posts...</span>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-2xl rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-8 text-yellow-600">Recent Culinary Adventures</h2>
            
            {blogPosts.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-amber-50 rounded-xl">
                <span role="img" aria-label="Plate and utensils" className="text-5xl mb-4 inline-block">🍽️</span>
                <p className="text-xl">No blog posts yet. Be the first to share your culinary journey!</p>
              </div>
            ) : (
              <div className="space-y-12">
                {blogPosts.map((post) => {
                  const embedUrl = post.videoUrl ? getYouTubeEmbedUrl(post.videoUrl) : null;
                  const postDate = formatDate(post.date || post.createdAt);
                  const isEditing = editingPost === post._id;
                  
                  return (
                    <div key={post._id || post.id} className="border-b border-gray-200 pb-10 last:border-b-0 hover:bg-amber-50 p-6 rounded-lg transition-colors duration-200">
                      {isEditing ? (
                        // Edit Form
                        <div className="space-y-4">
                          <h3 className="text-2xl font-bold text-yellow-600 mb-4">Edit Blog Post</h3>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Blog Title</label>
                            <input
                              type="text"
                              name="title"
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                              value={editFormData.title}
                              onChange={handleEditInputChange}
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
                            <select
                              name="category"
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                              value={editFormData.category}
                              onChange={handleEditInputChange}
                              required
                            >
                              <option value="">Select a category</option>
                              <option value="Breakfast">Breakfast</option>
                              <option value="Lunch">Lunch</option>
                              <option value="Dinner">Dinner</option>
                              <option value="Dessert">Dessert</option>
                              <option value="Snacks">Snacks</option>
                              <option value="Beverages">Beverages</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Blog Content</label>
                            <textarea
                              name="content"
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                              value={editFormData.content}
                              onChange={handleEditInputChange}
                              rows="6"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                              Video URL
                              <span className="text-xs font-normal text-gray-500 ml-2">(Optional)</span>
                            </label>
                            <input
                              type="url"
                              name="videoUrl"
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                              value={editFormData.videoUrl}
                              onChange={handleEditInputChange}
                              placeholder="https://youtube.com/watch?v=..."
                            />
                            {editFormData.videoUrl && !isValidYouTubeUrl(editFormData.videoUrl) && (
                              <p className="text-red-500 mt-1 text-xs">Please enter a valid YouTube URL</p>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                              Author's Personal Advice
                              <span className="text-xs font-normal text-gray-500 ml-2">(Optional)</span>
                            </label>
                            <textarea
                              name="authorAdvice"
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                              value={editFormData.authorAdvice}
                              onChange={handleEditInputChange}
                              rows="4"
                            />
                          </div>
                          
                          <div className="flex justify-end space-x-3 pt-2">
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(post._id)}
                              disabled={isSubmitting || !editFormData.title || !editFormData.content || !editFormData.category || (editFormData.videoUrl && !isValidYouTubeUrl(editFormData.videoUrl))}
                              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSubmitting ? (
                                <>
                                  <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Saving...
                                </>
                              ) : (
                                'Save Changes'
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Regular Post Display
                        <>
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-2xl font-bold text-yellow-600">{post.title}</h3>
                            {post.category && (
                              <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                                {post.category}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mb-4">Posted on {postDate}</p>
                          
                          {/* Blog Content */}
                          <div className="text-gray-700 whitespace-pre-line leading-relaxed mb-6">
                            {post.content}
                          </div>
                          
                          {/* Video Embed - Only if a valid YouTube URL was provided */}
                          {embedUrl && (
                            <div className="mb-6">
                              <h4 className="text-lg font-semibold text-gray-700 mb-3">Video Demonstration</h4>
                              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                                <iframe 
                                  src={embedUrl} 
                                  title={`Video for ${post.title}`}
                                  className="w-full h-64 md:h-96"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                  allowFullScreen
                                ></iframe>
                              </div>
                            </div>
                          )}
                          
                          {/* Author's Personal Advice - Only if provided */}
                          {post.authorAdvice && (
                            <div className="bg-amber-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mt-4">
                              <h4 className="text-lg font-semibold text-yellow-700 mb-2">
                                <span role="img" aria-label="Light bulb" className="mr-2">💡</span>
                                Author's Personal Advice
                              </h4>
                              <p className="text-gray-700 italic">{post.authorAdvice}</p>
                            </div>
                          )}
                          
                          {/* Action Buttons */}
                          <div className="mt-6 flex justify-end space-x-2">
                            <button 
                              onClick={() => handleEditClick(post)}
                              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(post._id)}
                              className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;