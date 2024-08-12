import React from 'react';

function MatchCard({ match, onLike, onPass }) {
  return (
    <div className="match-card">
      <h3>{match.name}</h3>
      <button onClick={onLike}>Like</button>
      <button onClick={onPass}>Pass</button>
    </div>
  );
}

export default MatchCard;
