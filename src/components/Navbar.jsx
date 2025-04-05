// Navbar.jsx - Consistent styling with other components
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-white text-2xl font-extrabold tracking-tight">Culinary Quest</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className="text-white hover:bg-yellow-600 px-4 py-2 rounded-md text-lg font-medium transition-colors duration-200">
              Home
            </Link>
            <Link to="/blog" className="text-white hover:bg-yellow-600 px-4 py-2 rounded-md text-lg font-medium transition-colors duration-200">
              Blog
            </Link>
            <button className="ml-4 bg-white text-yellow-600 hover:text-orange-600 hover:bg-gray-100 px-6 py-2 rounded-full text-lg font-bold shadow-md transition-all duration-200">
              Sign In
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-yellow-600 p-2 rounded-md"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-yellow-500">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="text-white hover:bg-yellow-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/blog" 
              className="text-white hover:bg-yellow-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            <button className="mt-2 w-full bg-white text-yellow-600 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium">
              Sign In
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
