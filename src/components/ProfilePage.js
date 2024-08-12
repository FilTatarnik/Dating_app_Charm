import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import PhotoUpload from './PhotoUpload';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile...'); // Add this log
        const userProfile = await userService.getProfile();
        console.log('Fetched profile:', userProfile); // Add this log
        setProfile(userProfile);
        setEditedProfile(userProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = await userService.updateProfile(editedProfile);
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <label>
            Bio:
            <textarea name="bio" value={editedProfile.bio} onChange={handleChange} />
          </label>
          <label>
            Gender:
            <input type="text" name="gender" value={editedProfile.gender} onChange={handleChange} />
          </label>
          <label>
            Orientation:
            <input type="text" name="orientation" value={editedProfile.orientation} onChange={handleChange} />
          </label>
          <label>
            Location:
            <input type="text" name="location" value={editedProfile.location} onChange={handleChange} />
          </label>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
 ) : (
  <>
    <p><strong>Name:</strong> {user.name || 'Not available'}</p>
    <p><strong>Email:</strong> {user.email || 'Not available'}</p>
    <p><strong>Bio:</strong> {user.bio || 'No bio yet'}</p>
    <p><strong>Gender:</strong> {user.gender || 'Not specified'}</p>
    <p><strong>Orientation:</strong> {user.orientation || 'Not specified'}</p>
    <p><strong>Location:</strong> {user.location || 'Not specified'}</p>
    {user.date_of_birth && (
      <p><strong>Date of Birth:</strong> {new Date(user.date_of_birth).toLocaleDateString()}</p>
    )}
    
    <button onClick={handleEdit}>Edit Profile</button>
    <button onClick={handleLogout}>Logout</button>
  </>
)}
<PhotoUpload userId={user?.id} />
</div>
);
}

export default ProfilePage;
