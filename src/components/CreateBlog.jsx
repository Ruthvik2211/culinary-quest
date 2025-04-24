import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const CreateBlog = ({ addBlogPost }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [authorAdvice, setAuthorAdvice] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() === '' || content.trim() === '') return;
    
    setIsSubmitting(true);
    
    try {
      // Create new blog post with additional fields
      const newPost = {
        title,
        content,
        category,
        videoUrl: videoUrl.trim(),
        authorAdvice: authorAdvice.trim(),
        // Add video file if one was selected
        videoFile: videoFile
      };
      
      // Add new post using the function passed as prop (which now calls the API)
      await addBlogPost(newPost);
      
      // Reset form fields
      setTitle('');
      setContent('');
      setCategory('');
      setVideoUrl('');
      setVideoFile(null);
      setVideoPreview(null);
      setAuthorAdvice('');
      
      console.log("Blog Submitted Successfully");
      
      // Redirect to blog list page
      navigate('/blogs');
    } catch (error) {
      console.error("Error submitting blog:", error);
      alert("Failed to create blog post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to validate YouTube URL format
  const isValidYouTubeUrl = (url) => {
    if (!url) return true; // Empty URL is valid (optional field)
    
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
    return youtubeRegex.test(url);
  };

  // Handle video file upload
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        alert('Please upload a valid video file');
        return;
      }
      
      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        alert('Video file size should be less than 100MB');
        return;
      }
      
      setVideoFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
      
      // Clear YouTube URL if a file is uploaded
      if (videoUrl) {
        setVideoUrl('');
      }
    }
  };

  // Clear selected video file
  const handleClearVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    
    // Release the object URL to avoid memory leaks
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
          Create New Recipe
        </h1>
        
        {/* Blog Post Form */}
        <div className="bg-white shadow-2xl rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-8 text-yellow-600">Share Your Culinary Adventure</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Fields */}
            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700">Recipe Title</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your blog title"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-lg font-medium mb-2 text-gray-700">Category</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                disabled={isSubmitting}
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
              <label className="block text-lg font-medium mb-2 text-gray-700">Recipe Content</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="6"
                placeholder="Write your culinary adventures here..."
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Toggle for Advanced Options */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center text-yellow-600 hover:text-orange-600 font-medium transition-colors duration-200"
                disabled={isSubmitting}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 mr-2 transform transition-transform duration-200 ${showAdvanced ? 'rotate-90' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
              </button>
            </div>

            {/* Advanced Options - Conditionally Rendered */}
            {showAdvanced && (
              <div className="space-y-6 pt-2 pb-4 border-t border-gray-200">
                {/* Video Options Section */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3 text-gray-700">Video Options</h3>
                  
                  {/* Video Upload Option */}
                  <div className="mb-4">
                    <label className="block text-base font-medium mb-2 text-gray-700">
                      Upload Video
                      <span className="text-sm font-normal text-gray-500 ml-2">(Optional - Maximum 100MB)</span>
                    </label>
                    
                    {!videoFile ? (
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                        <div className="space-y-1 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M24 10v13m0 0l-4-4m4 4l4-4M6 20.4V6.1A2.1 2.1 0 018.1 4h31.8A2.1 2.1 0 0142 6.1v26.8a2.1 2.1 0 01-2.1 2.1H8.1A2.1 2.1 0 016 32.9V28" strokeLinecap="round" strokeWidth="2" />
                          </svg>
                          <div className="flex justify-center text-sm text-gray-600">
                            <label htmlFor="video-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-yellow-600 hover:text-yellow-500 focus-within:outline-none">
                              <span>Upload a video</span>
                              <input 
                                id="video-upload" 
                                name="video-upload" 
                                type="file" 
                                accept="video/*"
                                className="sr-only"
                                onChange={handleVideoUpload}
                                disabled={isSubmitting}
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">MP4, MOV, AVI up to 100MB</p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1">
                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="ml-2 text-sm font-medium text-gray-900 truncate">
                                {videoFile.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={handleClearVideo}
                              className="ml-2 text-red-600 hover:text-red-800"
                              disabled={isSubmitting}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                          
                          {/* Video preview */}
                          {videoPreview && (
                            <div className="mt-3">
                              <video 
                                controls 
                                className="w-full h-auto rounded"
                                src={videoPreview}
                              >
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Or separator */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or</span>
                    </div>
                  </div>
                  
                  {/* YouTube URL Field */}
                  <div className={videoFile ? "opacity-50" : ""}>
                    <label className="block text-base font-medium mb-2 text-gray-700">
                      YouTube Video URL 
                      <span className="text-sm font-normal text-gray-500 ml-2">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      disabled={isSubmitting || videoFile !== null}
                    />
                    {videoUrl && !isValidYouTubeUrl(videoUrl) && (
                      <p className="text-red-500 mt-1 text-sm">Please enter a valid YouTube URL</p>
                    )}
                    {videoFile && (
                      <p className="text-sm text-gray-500 mt-1">
                        YouTube URL cannot be used when a video file is uploaded. Clear the uploaded video to use a YouTube URL instead.
                      </p>
                    )}
                  </div>

                  {/* Author's Personal Advice Field */}
                  <div className="mt-6">
                    <label className="block text-lg font-medium mb-2 text-gray-700">
                      Author's Personal Advice
                      <span className="text-sm font-normal text-gray-500 ml-2">(Optional - Share your personal tips)</span>
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                      value={authorAdvice}
                      onChange={(e) => setAuthorAdvice(e.target.value)}
                      rows="4"
                      placeholder="Share your personal tips, tricks or recommendations related to this recipe or culinary adventure..."
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || (videoUrl && !isValidYouTubeUrl(videoUrl))}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 text-lg font-bold rounded-lg shadow-lg hover:shadow-xl text-white transform hover:translate-y-px transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Publish Blog
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;