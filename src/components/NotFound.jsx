// NotFound.jsx - Styled to match app theme
import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 px-4">
      <div className="bg-white p-12 rounded-2xl shadow-2xl max-w-lg w-full text-center">
        <div className="text-8xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 font-bold mb-4">404</div>
        <h2 className="text-3xl text-gray-800 font-bold mb-6">Page Not Found</h2>
        <p className="text-gray-600 mb-8 text-lg">The recipe you're looking for seems to have disappeared from our kitchen!</p>
        <Link to="/" className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-3 text-lg font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-white">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
