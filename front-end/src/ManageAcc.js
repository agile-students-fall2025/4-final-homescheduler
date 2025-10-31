import React, { useState } from 'react';
import './ManageAcc.css'
import logo from './logo.png';

import { useNavigate } from 'react-router-dom'

export function ManageAcc(){
    const [firstName, setFName] = useState('');
    const [lastName, setLName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/change_password');
    };

    return (
        <div className="manage-container">

            <img src={logo} alt="App Logo" className="app-logo" />
            <h1 className="acc-title">
                Manage Account
            </h1>

            <form onSubmit={handleSubmit} className="name-login-form">
                <input
                    type = "firstName"
                    placeholder='first name'
                    value = {firstName}
                    onChange={(e) => setFName(e.target.value)}

                />
                <input 
                    type = "lastName"
                    placeholder='last name'
                    value={lastName}
                    onChange={(e) => setLName(e.target.value)}
                />
            </form>
            <form onSubmit={handleSubmit} className="email-login-form">
                <input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type = 'submit' className="change_password_button" onClick={() => navigate('/change_password')}>
                    Change Password
                </button>
                <button type='button' className="update_info_button">
                    Update Information
                </button>
            </form>
        </div>
    )
}
