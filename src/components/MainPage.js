import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { matchService } from '../services/api';
import MatchCard from './MatchCard';

function MainPage() {
  const { potentialMatches, setPotentialMatches, loading, setLoading, error, setError } = useApp();
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  useEffect(() => {
    const fetchPotentialMatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const matches = await matchService.getPotentialMatches();
        setPotentialMatches(matches);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPotentialMatches();
  }, []);

  const handleLike = async () => {
    setLoading(true);
    setError(null);
    try {
      await matchService.likeUser(potentialMatches[currentMatchIndex].id);
      setCurrentMatchIndex(prevIndex => prevIndex + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePass = () => {
    setCurrentMatchIndex(prevIndex => prevIndex + 1);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      {potentialMatches.length > 0 && currentMatchIndex < potentialMatches.length ? (
        <MatchCard 
          match={potentialMatches[currentMatchIndex]} 
          onLike={handleLike} 
          onPass={handlePass} 
        />
      ) : (
        <p>No more potential matches</p>
      )}
    </div>
  );
}

export default MainPage;