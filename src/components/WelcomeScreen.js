import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import '../index.css';

function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <div className="content-container welcome-screen">
        <h1>Welcome to Charm</h1>
        <p>Find your perfect match today!</p>
        <div className="button-group">
          <button onClick={() => navigate('/register')} className="submit-button">Register</button>
          <button onClick={() => navigate('/login')} className="submit-button">Login</button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;