import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import PhotoUpload from './PhotoUpload';
import '../App.css';
import '../index.css';

function ProfileSetup() {
  const [profile, setProfile] = useState({
    bio: '',
    gender: '',
    orientation: '',
    location: '',
    profileCompleted: false
  });
  const [error, setError] = useState('');
  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      console.log('User not found, redirecting to login');
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!user) {
      console.error('User is not defined');
      setError('User is not authenticated. Please log in again.');
      return;
    }
    try {
      console.log('Submitting profile data:', profile);
      const updatedUser = await userService.updateProfile({
        ...profile,
        profileCompleted: true
      });
      console.log('Profile update response:', updatedUser);
      setUser({ ...user, ...updatedUser });
      navigate('/profile');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'An error occurred while updating the profile');
    }
  };

  if (loading) return <div className="App"><div className="content-container">Loading...</div></div>;
  if (!user) return null;

  return (
    <div className="App">
      <div className="content-container">
        <h1>Complete Your Profile</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="bio">Bio:</label>
            <textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender:</label>
            <input
              type="text"
              id="gender"
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              placeholder="Your gender"
            />
          </div>
          <div className="form-group">
            <label htmlFor="orientation">Orientation:</label>
            <input
              type="text"
              id="orientation"
              name="orientation"
              value={profile.orientation}
              onChange={handleChange}
              placeholder="Your orientation"
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={profile.location}
              onChange={handleChange}
              placeholder="Your location"
            />
          </div>
          <PhotoUpload userId={user.id} />
          <button type="submit" className="submit-button">Complete Profile</button>
        </form>
      </div>
    </div>
  );
}

export default ProfileSetup;