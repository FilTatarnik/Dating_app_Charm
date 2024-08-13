import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';
import '../index.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [error, setError] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userService.getProfile();
      setProfile(response.data);
      setEditedProfile(response.data);
    } catch (err) {
      setError('Failed to fetch profile data');
      console.error('Error fetching profile:', err);
    }
  };

  const handleHomeClick = () => {
    navigate('/main');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleChange = (e) => {
    setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile(editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
      // Optionally, show a success message
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (error) return <div className="App"><div className="content-container">Error: {error}</div></div>;
  if (!profile) return <div className="App"><div className="content-container">Loading...</div></div>;

  return (
    <div className="App">
      <div className="content-container">
        <h1>Your Profile</h1>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            {['name', 'email', 'bio', 'gender', 'orientation', 'location'].map((field) => (
              <div key={field} className="form-field">
                <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                {field === 'bio' ? (
                  <textarea
                    id={field}
                    name={field}
                    value={editedProfile[field] || ''}
                    onChange={handleChange}
                  />
                ) : (
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    id={field}
                    name={field}
                    value={editedProfile[field] || ''}
                    onChange={handleChange}
                  />
                )}
              </div>
            ))}
            <div className="button-group">
              <button type="submit">Save</button>
              <button type="button" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            {['name', 'email', 'bio', 'gender', 'orientation', 'location'].map((field) => (
              <p key={field}><strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {profile[field] || 'Not specified'}</p>
            ))}
            <button onClick={handleEdit}>Edit Profile</button>
          </div>
        )}
        <div className="button-group">
          <button onClick={handleHomeClick}>Home</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;