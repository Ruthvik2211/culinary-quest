// Home.jsx - Updated to match styling
import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 text-gray-800 flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-2xl p-8 md:p-12">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
          Culinary Quest
        </h1>
        
        <p className="text-xl md:text-2xl mb-10 text-center font-light">
          Create, share, and explore food blogs from passionate culinary enthusiasts around the world!
        </p>
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-6 text-yellow-600">Features:</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-amber-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
              <span role="img" aria-label="Writing" className="text-amber-600 text-4xl mb-4 inline-block">📝</span>
              <h3 className="text-xl font-semibold mb-2">Share Your Recipes</h3>
              <p className="text-gray-600">Create beautiful food blogs to showcase your culinary creations</p>
            </div>
            
            <div className="bg-amber-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
              <span role="img" aria-label="Globe" className="text-amber-600 text-4xl mb-4 inline-block">🌍</span>
              <h3 className="text-xl font-semibold mb-2">Explore Adventures</h3>
              <p className="text-gray-600">Discover new recipes and food stories from around the world</p>
            </div>
            
            <div className="bg-amber-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
              <span role="img" aria-label="Sparkles" className="text-amber-600 text-4xl mb-4 inline-block">✨</span>
              <h3 className="text-xl font-semibold mb-2">Get Recommendations</h3>
              <p className="text-gray-600">Receive personalized food suggestions based on your taste</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/create-blog" className="bg-gradient-to-r from-yellow-500 to-orange-500 px-8 py-4 text-lg font-bold rounded-full shadow-lg hover:shadow-xl text-white transform hover:scale-105 transition-all duration-300">
            Start Your Culinary Journey
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
