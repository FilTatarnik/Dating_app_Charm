import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchService, userService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';
import '../index.css';

const MainPage = () => {
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchUserProfile();
    fetchPotentialMatches();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await userService.getProfile();
      setUserProfile(response.data);
    } catch (err) {
      setError('Failed to fetch user profile');
      console.error('Error fetching user profile:', err);
    }
  };

  const fetchPotentialMatches = async () => {
    try {
      const response = await matchService.getPotentialMatches();
      console.log('Potential matches data:', response.data);
      setPotentialMatches(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch potential matches');
      console.error('Error fetching potential matches:', err);
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!currentMatch) return;
    try {
      await matchService.likeUser(currentMatch.id);
      moveToNextMatch();
    } catch (err) {
      setError('Failed to like user');
      console.error('Error liking user:', err);
    }
  };

  const handleDislike = () => {
    moveToNextMatch();
  };

  const moveToNextMatch = () => {
    if (currentMatchIndex < potentialMatches.length - 1) {
      setCurrentMatchIndex(currentMatchIndex + 1);
    } else {
      setCurrentMatchIndex(potentialMatches.length);
    }
  };

  if (loading) return <div className="App"><div className="content-container">Loading...</div></div>;
  if (error) return <div className="App"><div className="content-container">Error: {error}</div></div>;

  const currentMatch = potentialMatches[currentMatchIndex];

  return (
    <div className="App">
      <div className="content-container">
        <h1>Welcome, {userProfile?.name || user?.name || 'User'}!</h1>
        
        <div className="potential-match">
          <h2>Potential Match</h2>
          {currentMatch ? (
            <div>
              <p><strong>Name:</strong> {currentMatch.name}</p>
              <p><strong>Bio:</strong> {currentMatch.bio || 'No bio available'}</p>
              <p><strong>Location:</strong> {currentMatch.location || 'Location not specified'}</p>
              <div className="button-group">
                <button onClick={handleDislike}>Dislike</button>
                <button onClick={handleLike}>Like</button>
              </div>
            </div>
          ) : (
            <div>
              <p>No Potential Matches</p>
              <p>Check back later for new potential matches!</p>
            </div>
          )}
        </div>

        <div className="button-group">
          <button onClick={() => navigate('/profile')}>View Profile</button>
          <button onClick={() => navigate('/matches')}>View Matches</button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;