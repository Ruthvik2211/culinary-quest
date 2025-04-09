// src/components/SignIn.jsx
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  
  const { login, userInfo, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is already logged in, redirect to home page
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    
    if (!email || !password) {
      setMessage('Please fill in all fields');
      return;
    }
    
    try {
      await login(email, password);
      // The navigation happens in the useEffect when userInfo changes
    } catch (err) {
      setMessage(err.message || 'Invalid email or password'); // More specific error
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden p-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-yellow-600 mb-6">Sign In to Your Account</h2>
          <p className="mt-2 text-sm text-gray-600 mb-8">
            Or{' '}
            <Link to="/signup" className="font-medium text-orange-500 hover:text-orange-600">
              create a new account
            </Link>
          </p>
        </div>
        
        {message && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="font-medium text-orange-500 hover:text-orange-600">
                Forgot your password?
              </a>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div>
              <button
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.917.678 1.852 0 1.335-.012 2.415-.012 2.741 0 .267.18.578.688.48A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </button>
            </div>
            
            <div>
              <button
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 5.01 3.438 9.27 8.205 10.4-.03-.522-.262-2.646.052-3.57.284-.88 1.828-5.6 1.828-5.6s-.464-.93-.464-2.3c0-2.162 1.25-3.77 2.814-3.77 1.33 0 1.97.996 1.97 2.19 0 1.332-.848 3.327-1.288 5.174-.366 1.547.776 2.81 2.304 2.81 2.77 0 4.636-3.56 4.636-7.783 0-3.21-2.16-5.6-6.1-5.6-4.44 0-7.21 3.312-7.21 7.007 0 1.273.38 2.173 1.003 2.876.304.36.38.506.26.916l-.396 1.62c-.124.497-.404.6-.93.29-2.584-1.154-3.8-4.254-3.8-7.734 0-5.76 4.866-12.64 14.516-12.64 7.766 0 12.874 5.62 12.874 11.634 0 7.962-4.424 13.922-10.936 13.922-2.158 0-4.232-1.165-4.936-2.494z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;