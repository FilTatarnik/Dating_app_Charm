import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchService } from '../services/api';
import '../App.css';
import '../index.css';

const MatchList = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await matchService.getMatches();
      setMatches(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch matches');
      console.error('Error fetching matches:', err);
      setLoading(false);
    }
  };

  const navigateToChat = (matchId) => {
    navigate(`/chat/${matchId}`);
  };

  if (loading) return <div className="App"><div className="content-container">Loading...</div></div>;
  if (error) return <div className="App"><div className="content-container">Error: {error}</div></div>;

  return (
    <div className="App">
      <div className="content-container">
        <h1>Your Matches</h1>
        {matches.length > 0 ? (
          <ul className="match-list">
            {matches.map(match => (
              <li key={match.id} className="match-item">
                <div>
                  <h3>{match.name}</h3>
                  <p>{match.bio || 'No bio available'}</p>
                </div>
                <button onClick={() => navigateToChat(match.id)}>Chat</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>You don't have any matches yet. Keep swiping!</p>
        )}
        <button onClick={() => navigate('/main')} className="secondary">Back to Main</button>
      </div>
    </div>
  );
};

export default MatchList;