// Blog.jsx - Adjusted to match app style
import React, { useState } from 'react';
import '../index.css';
const Blog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [blogPosts, setBlogPosts] = useState([]);
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === '' || content.trim() === '') return;
    
    // Add new blog post to the array
    const newPost = {
      id: Date.now(), // Use timestamp as unique ID
      title,
      content,
      category,
      date: new Date().toLocaleDateString()
    };
    
    setBlogPosts([newPost, ...blogPosts]); // Add new post at the beginning
    
    // Reset form fields
    setTitle('');
    setContent('');
    setCategory('');
    
    console.log("Blog Submitted:", newPost);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
          Culinary Quest Blog
        </h1>
        
        {/* Blog Post Form */}
        <div className="bg-white shadow-2xl rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-8 text-yellow-600">Share Your Culinary Adventure</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700">Blog Title</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your blog title"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700">Category</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option key="default" value="">Select a category</option>
                <option key="breakfast" value="Breakfast">Breakfast</option>
                <option key="lunch" value="Lunch">Lunch</option>
                <option key="dinner" value="Dinner">Dinner</option>
                <option key="dessert" value="Dessert">Dessert</option>
                <option key="snacks" value="Snacks">Snacks</option>
                <option key="beverages" value="Beverages">Beverages</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700">Blog Content</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="6"
                placeholder="Write your culinary adventures here..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 text-lg font-bold rounded-lg shadow-lg hover:shadow-xl text-white transform hover:translate-y-px transition-all duration-200 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Publish Blog
            </button>
          </form>
        </div>
        
        {/* Blog Posts List */}
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-8 text-yellow-600">Recent Culinary Adventures</h2>
          
          {blogPosts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-amber-50 rounded-xl">
              <span role="img" aria-label="Plate and utensils" className="text-5xl mb-4 inline-block">🍽️</span>
              <p className="text-xl">No blog posts yet. Be the first to share your culinary journey!</p>
            </div>
          ) : (
            <div className="space-y-10">
              {blogPosts.map((post) => (
                <div key={post.id} className="border-b border-gray-200 pb-8 last:border-b-0 hover:bg-amber-50 p-4 rounded-lg transition-colors duration-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-2xl font-bold text-yellow-600">{post.title}</h3>
                    {post.category && (
                      <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Posted on {post.date}</p>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
