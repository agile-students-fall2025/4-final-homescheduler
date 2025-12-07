import React, { useState, useEffect } from 'react';
import './HomePage.css'; 
import logo from './logo.png';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();
  
  const storedUser = localStorage.getItem("user");
  const user = storedUser && storedUser !== "null" ? JSON.parse(storedUser) : null;
  const username = user?.name || "Guest";

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const weekday = currentDateTime.toLocaleString("en-US", {
    weekday: "long",
  });

  const date = currentDateTime.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const time = currentDateTime.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="home-container">
      <img src={logo} alt="App Logo" className="app-logo" />
      <h1 className="app-title">Home Scheduler</h1>

      <div className="welcome-box">
        <p>Welcome {username}!</p>

       

      </div>
      <div className="date-time-widget">
        <div className="dt-weekday">{weekday}</div>
        <div className="dt-date">{date}</div>
        <div className="dt-time">{time}</div>
      </div>
      
      <div className="button-group">
        <button className="home-button" onClick={() => navigate('/myschedule')}>
          Master Schedule
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
