// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { registerUser, loginUser, logoutUser } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);
  
  // Register a new user
  const signup = async (username, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await registerUser({ name: username, email, password });
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (error) {
      setError(error);
      setLoading(false);
      throw error;
    }
  };
  
  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await loginUser(email, password);
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (error) {
      setError(error);
      setLoading(false);
      throw error;
    }
  };
  
  // Logout user
  const logout = () => {
    logoutUser();
    setUserInfo(null);
  };
  
  return (
    <AuthContext.Provider
      value={{
        userInfo,
        loading,
        error,
        signup,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};