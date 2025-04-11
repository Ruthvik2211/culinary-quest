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

export const fetchBlogPosts = async () => {
  try {
    const response = await apiClient.get('/blogs');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch blog posts');
    throw error;
  }
};

export const createBlogPost = async (blogData) => {
  try {
    const response = await apiClient.post('/blogs', blogData);
    console.log('Blog post created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to create blog post');
    throw error;
  }
};

export const updateBlogPost = async (id, blogData) => {
  try {
    const response = await apiClient.put(`/blogs/${id}`, blogData);
    return response.data;
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