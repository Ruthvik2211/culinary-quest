// src/services/apiClient.js
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

// Add request interceptor for logging
apiClient.interceptors.request.use(config => {
  console.log(`📤 Making ${config.method.toUpperCase()} request to: ${config.url}`);
  return config;
});

// Add response interceptor for logging
apiClient.interceptors.response.use(
  response => {
    console.log(`📥 Received response from: ${response.config.url}, status: ${response.status}`);
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

export default apiClient;