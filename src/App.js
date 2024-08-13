import React from 'react';
import { Routes, Route } from 'react-router-dom';import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import WelcomeScreen from './components/WelcomeScreen';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import ProfileSetup from './components/ProfileSetup';
import MainPage from './components/MainPage';
import MatchList from './components/MatchList';
import ChatInterface from './components/ChatInterface';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';
import './App.css';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/matches" element={<MatchList />} />
          <Route path="/chat/:matchId" element={<ChatInterface />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;