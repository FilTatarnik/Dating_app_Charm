import React from 'react';
import '../App.css';
import '../index.css';

function MatchCard({ match, onLike, onPass }) {
  return (
    <div className="match-card">
      <h3>{match.name}</h3>
      <p>{match.bio || 'No bio available'}</p>
      <p>{match.location || 'Location not specified'}</p>
      <div className="button-group">
        <button onClick={onPass} className="secondary">Pass</button>
        <button onClick={onLike}>Like</button>
      </div>
    </div>
  );
}

export default MatchCard;