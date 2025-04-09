import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { updateUserProfile } from '../services/authService';

const Profile = () => {
  const { userInfo } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    profilePicture: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Debug state to see what userInfo contains
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    console.log("Profile component mounted, userInfo:", userInfo);
    
    if (userInfo) {
      console.log("Setting form data from userInfo:", userInfo);
      setDebugInfo(JSON.stringify(userInfo, null, 2));
      
      setFormData({
        username: userInfo.name || '',
        email: userInfo.email || '',
        bio: userInfo.bio || '',
        profilePicture: userInfo.profilePicture || '',
        password: '',
        confirmPassword: ''
      });
    } else {
      console.log("No userInfo available");
      setDebugInfo("No user info available");
    }
  }, [userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Check if passwords match if trying to update password
    if (formData.password && formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    // Check password length if provided
    if (formData.password && formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setLoading(true);
      
      // Only include password if it's been provided
      const updatedData = {
        name: formData.username, // Send as 'name' to match backend
        email: formData.email,
        bio: formData.bio,
        profilePicture: formData.profilePicture,
        ...(formData.password && { password: formData.password })
      };
      
      console.log("Updating profile with data:", updatedData);
      await updateUserProfile(updatedData);
      setSuccess('Profile updated successfully!');
      
      // Clear password fields after successful update
      setFormData({
        ...formData,
        password: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(typeof err === 'string' ? err : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Your Profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Update your personal information
        </p>
      </div>

      {/* Debug section */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-2xl">
          <details className="bg-gray-100 p-4 rounded-md shadow mb-4">
            <summary className="cursor-pointer font-medium">Debug Info</summary>
            <pre className="mt-2 text-xs overflow-auto">{debugInfo}</pre>
          </details>
        </div>
      )}

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        {!userInfo ? (
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 text-center">
            <p className="text-gray-700">Loading profile information...</p>
            <p className="text-sm text-gray-500 mt-2">If this persists, you may need to log in again.</p>
          </div>
        ) : (
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4">
                <span className="block sm:inline">{success}</span>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <div className="mt-1">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

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
                      value={formData.email}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">
                  Profile Picture URL
                </label>
                <div className="mt-1">
                  <input
                    id="profilePicture"
                    name="profilePicture"
                    type="text"
                    value={formData.profilePicture}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <div className="mt-1">
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Tell us about yourself and your culinary interests"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900">Update Password</h3>
                <p className="text-sm text-gray-500">Leave blank if you don't want to change your password</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;