import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { matchService } from '../services/api';

function MatchList() {
  const { matches, setMatches, loading, setLoading, error, setError } = useApp();

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const userMatches = await matchService.getMatches();
        setMatches(userMatches);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>Your Matches</h2>
      {matches.map(match => (
        <Link key={match.id} to={`/chat/${match.id}`}>
          <div>{match.name}</div>
        </Link>
      ))}
    </div>
  );
}

export default MatchList;