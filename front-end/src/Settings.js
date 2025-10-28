import React from 'react';
import './Settings.css';
import logo from './logo.png';
import { useNavigate } from 'react-router-dom';

export function Settings() {
    const navigate = useNavigate();

    return (
        <div className = "setting-container">
            <img src={logo} alt="App Logo" className="app-logo" />
            <h1 className="app-title">
                Settings
            </h1>

            <div className = "button-group">
                <button className = "setting-button" onClick={() => navigate('/manage-account')}>
                    Manage Account
                </button>
                <button className = "setting-button" onClick={() => navigate('/join_fam')}>
                    Join or Create Family Schedule
                </button>
            </div>
        </div>
    );
}