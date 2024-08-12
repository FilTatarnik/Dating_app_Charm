import React, { useState, useContext } from 'react';
import { userService } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { useAuth } from '../contexts/AuthContext';

function SettingsPage() {
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    maxDistance: 50,
    ageRange: [18, 99],
  });
  const { user } = useAuth();

  const handleChange = (setting, value) => {
    setSettings(prevSettings => ({ ...prevSettings, [setting]: value }));
  };

  const handleSave = async () => {
    await userService.updateSettings(user.id, settings);
  };

  return (
    <div>
      <h2>Settings</h2>
      {/* Render settings fields */}
      <button onClick={handleSave}>Save Settings</button>
    </div>
  );
}

export default SettingsPage;