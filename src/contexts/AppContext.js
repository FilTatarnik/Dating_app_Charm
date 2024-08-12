import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <AppContext.Provider value={{ 
      potentialMatches, 
      setPotentialMatches, 
      matches, 
      setMatches, 
      loading, 
      setLoading, 
      error, 
      setError 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);