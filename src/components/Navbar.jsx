// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-orange-500">CulinaryConnect</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/blogs" className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium">
                Blogs
              </Link>
              {userInfo && (
                <Link to="/create-blog" className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium">
                  Create Blog
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {userInfo ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/signin" className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium">
                  Sign In
                </Link>
                <Link to="/signup" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;