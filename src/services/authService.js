import axios from 'axios';

// Use environment variable if available, otherwise default to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/users';

// Register user
export const registerUser = async ({ name, email, password }) => {
  try {
    console.log('Registering user:', { name, email });
    const response = await axios.post(`${API_URL}/register`, { name, email, password });
    
    if (response.data) {
      localStorage.setItem('userInfo', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error.response?.data?.message || error.message;
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    console.log('Logging in user:', email);
    const response = await axios.post(`${API_URL}/login`, { email, password });
    
    if (response.data) {
      localStorage.setItem('userInfo', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error.response?.data?.message || error.message;
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('userInfo');
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    if (!userInfo || !userInfo.token) {
      throw new Error('Not authorized, no token');
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    };
    
    const response = await axios.get(`${API_URL}/profile`, config);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    if (!userInfo || !userInfo.token) {
      throw new Error('Not authorized, no token');
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    };
    
    const response = await axios.put(`${API_URL}/profile`, userData, config);
    
    if (response.data) {
      const updatedUserInfo = { ...userInfo, ...response.data };
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, { token, password: newPassword });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || error.message;
  }
};