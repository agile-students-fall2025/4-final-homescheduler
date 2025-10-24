import React from 'react';
import './HomePage.css'; 
import logo from './logo.png';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <img src={logo} alt="App Logo" className="app-logo" />
      <h1 className="app-title">Home Scheduler</h1>

      <div className="welcome-box">
        <p>Welcome [username]!</p>
      </div>

      <div className="button-group">
        <button className="home-button" onClick={() => navigate('/myschedule')}>
          My Schedule
        </button>

        <button className="home-button" onClick={() => navigate('/familyschedule')}>
          Family Schedule
        </button>

        <button className="home-button" onClick={() => navigate('/reminders')}>
          Reminders
        </button>

        <button className="home-button" onClick={() => navigate('/settings')}>
          Settings
        </button>
      </div>
    </div>
  );
}
