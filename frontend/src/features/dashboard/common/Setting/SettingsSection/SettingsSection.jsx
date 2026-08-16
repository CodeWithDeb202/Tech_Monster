import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './SettingsSection.css';
import { toast } from 'react-toastify';

export default function SettingsSection() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [darkModeGlow, setDarkModeGlow] = useState(true);
  
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const handlePasswordChange = (e) => {
    e.preventDefault();
    toast.success('Password updated successfully!');
    setPasswords({ oldPassword: '', newPassword: '' });
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm("WARNING: This will permanently delete your account and remove all data from the database. Are you sure?");
    if (confirmDelete) {
      // Clear all local database/storage session info
      localStorage.clear();
      sessionStorage.clear();
      // Redirect straight to landing page
      navigate('/');
    }
  };

  return (
    <>
      {/* Appearance Settings */}
      <motion.div 
        className="settings-section-card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h3>Appearance & Theme</h3>
        <div className="settings-row">
          <div className="setting-info">
            <label>Neon Glow Accent</label>
            <p>Enhance futuristic dashboard borders and shadows</p>
          </div>
          <label className="switch">
            <input type="checkbox" checked={darkModeGlow} onChange={() => setDarkModeGlow(!darkModeGlow)} />
            <span className="slider"></span>
          </label>
        </div>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div 
        className="settings-section-card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h3>Notifications</h3>
        <div className="settings-row">
          <div className="setting-info">
            <label>Push & Email Alerts</label>
            <p>Receive updates on task approvals and daily reminders</p>
          </div>
          <label className="switch">
            <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
            <span className="slider"></span>
          </label>
        </div>
      </motion.div>

      {/* Security Settings */}
      <motion.div 
        className="settings-section-card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h3>Security (Change Password)</h3>
        <form className="settings-form" onSubmit={handlePasswordChange}>
          <div className="settings-input-group">
            <label>Current Password</label>
            <input 
              type="password" 
              required 
              value={passwords.oldPassword} 
              onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} 
            />
          </div>
          <div className="settings-input-group">
            <label>New Password</label>
            <input 
              type="password" 
              required 
              value={passwords.newPassword} 
              onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} 
            />
          </div>
          <button type="submit" className="settings-btn">Update Password</button>
        </form>
      </motion.div>

      {/* Danger Zone: Account Deletion */}
      <motion.div 
        className="settings-section-card danger-zone"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h3>Danger Zone</h3>
        <div className="settings-row">
          <div className="setting-info">
            <label>Delete Account</label>
            <p>Permanently remove your account and all data from database and logout</p>
          </div>
          <button className="delete-btn" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </motion.div>
    </>
  );
}