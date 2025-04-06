import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const BlogList = ({ blogPosts, loading }) => {
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
                  
                  return (
                    <div key={post._id || post.id} className="border-b border-gray-200 pb-10 last:border-b-0 hover:bg-amber-50 p-6 rounded-lg transition-colors duration-200">
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
                      
                      {/* Action Buttons - Optional feature for future implementation */}
                      <div className="mt-6 flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-800 transition-colors duration-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
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