// services/api.js
import axios from 'axios';

// Use environment variable if available, otherwise default to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests when available
apiClient.interceptors.request.use(config => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  console.log(`📤 Making ${config.method.toUpperCase()} request to: ${config.url}`);
  return config;
});

// Add response interceptor for logging
apiClient.interceptors.response.use(
  response => {
    console.log(`📥 Received response from: ${response.config.url}`, response.status);
    return response;
  },
  error => {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      console.error(`❌ Error ${error.response.status} from ${error.config.url}:`, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('❌ No response received:', error.request);
    } else {
      // Something else happened while setting up the request
      console.error('❌ Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Get user's own blog posts
export const fetchBlogPosts = async () => {
  try {
    const response = await apiClient.get('/blogs');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch blog posts');
    throw error;
  }
};

// Get all public blog posts for the explore page
export const getAllPublicBlogPosts = async () => {
  try {
    const response = await apiClient.get('/blogs/public');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch public blog posts');
    throw error;
  }
};

// Get a single blog post by ID
export const getBlogPostById = async (id) => {
  try {
    const response = await apiClient.get(`/blogs/public/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch blog post with ID: ${id}`);
    throw error;
  }
};

export const createBlogPost = async (blogData) => {
  try {
    // Check if we have a file to upload
    if (blogData.videoFile) {
      // Use FormData for multipart/form-data
      const formData = new FormData();
      
      // Add the file to form data
      formData.append('video', blogData.videoFile);
      
      // Add other blog data
      Object.keys(blogData).forEach(key => {
        if (key !== 'videoFile') {
          formData.append(key, blogData[key]);
        }
      });
      
      // Use custom axios config for multipart/form-data
      const response = await axios.post(`${API_URL}/blogs`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`
        }
      });
      
      console.log('Blog post created successfully:', response.data);
      return response.data;
    } else {
      // Standard JSON request (no file upload)
      const response = await apiClient.post('/blogs', blogData);
      console.log('Blog post created successfully:', response.data);
      return response.data;
    }
  } catch (error) {
    console.error('Failed to create blog post');
    throw error;
  }
};

export const updateBlogPost = async (id, blogData) => {
  try {
    // Check if we have a file to upload
    if (blogData.videoFile) {
      // Use FormData for multipart/form-data
      const formData = new FormData();
      
      // Add the file to form data
      formData.append('video', blogData.videoFile);
      
      // Add other blog data
      Object.keys(blogData).forEach(key => {
        if (key !== 'videoFile') {
          formData.append(key, blogData[key]);
        }
      });
      
      // Use custom axios config for multipart/form-data
      const response = await axios.put(`${API_URL}/blogs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`
        }
      });
      
      return response.data;
    } else {
      // Standard JSON request (no file upload)
      const response = await apiClient.put(`/blogs/${id}`, blogData);
      return response.data;
    }
  } catch (error) {
    console.error(`Failed to update blog post with ID: ${id}`);
    throw error;
  }
};

export const deleteBlogPost = async (id) => {
  try {
    const response = await apiClient.delete(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete blog post with ID: ${id}`);
    throw error;
  }
};