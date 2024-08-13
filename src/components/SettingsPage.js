import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';
import '../index.css';

function SettingsPage() {
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    maxDistance: 50,
    minAge: 18,
    maxAge: 99,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    // Fetch current settings when component mounts
    const fetchSettings = async () => {
      try {
        const currentSettings = await userService.getSettings(user.id);
        setSettings(currentSettings);
      } catch (err) {
        setError('Failed to fetch settings');
      }
    };
    fetchSettings();
  }, [user.id]);

  const handleChange = (setting, value) => {
    setSettings(prevSettings => ({ ...prevSettings, [setting]: value }));
  };

  const handleSave = async () => {
    try {
      await userService.updateSettings(user.id, settings);
      setSuccess('Settings saved successfully');
      setError('');
    } catch (err) {
      setError('Failed to save settings');
      setSuccess('');
    }
  };

  return (
    <div className="App">
      <div className="content-container">
        <h1>Settings</h1>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form className="settings-form">
          <div className="form-group">
            <label htmlFor="notificationsEnabled">
              <input
                type="checkbox"
                id="notificationsEnabled"
                checked={settings.notificationsEnabled}
                onChange={(e) => handleChange('notificationsEnabled', e.target.checked)}
              />
              Enable Notifications
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="maxDistance">Maximum Distance (km)</label>
            <input
              type="range"
              id="maxDistance"
              min="1"
              max="100"
              value={settings.maxDistance}
              onChange={(e) => handleChange('maxDistance', parseInt(e.target.value))}
            />
            <span>{settings.maxDistance} km</span>
          </div>
          <div className="form-group">
            <label htmlFor="minAge">Minimum Age</label>
            <input
              type="number"
              id="minAge"
              min="18"
              max="99"
              value={settings.minAge}
              onChange={(e) => handleChange('minAge', parseInt(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="maxAge">Maximum Age</label>
            <input
              type="number"
              id="maxAge"
              min="18"
              max="99"
              value={settings.maxAge}
              onChange={(e) => handleChange('maxAge', parseInt(e.target.value))}
            />
          </div>
          <button type="button" onClick={handleSave} className="submit-button">Save Settings</button>
        </form>
      </div>
    </div>
  );
}

export default SettingsPage;