import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getUserProfile } from '../services/authService';

const ViewProfile = () => {
  const { userInfo } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (userInfo) {
          const data = await getUserProfile();
          setProfileData(data);
        } else {
          setError('You must be logged in to view your profile');
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userInfo]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="text-center">
          <p className="text-xl">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/login" className="text-orange-500 hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const userData = profileData || userInfo;

  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Your Profile
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
            <div className="w-32 h-32 flex-shrink-0">
              {userData?.profilePicture ? (
                <img 
                  src={userData.profilePicture} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover border-4 border-orange-200"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-orange-100 flex items-center justify-center border-4 border-orange-200">
                  <span className="text-4xl text-orange-400">
                    {userData?.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{userData?.name}</h3>
                  <p className="text-gray-600">{userData?.email}</p>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900">Bio</h4>
                  <p className="text-gray-700 mt-1">
                    {userData?.bio || 'No bio provided yet.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <Link 
              to="/update-profile" 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Update Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;