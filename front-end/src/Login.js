import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './logo.png';
import './Login.css'; 

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="login-container">
        <img src={logo} alt="App Logo" className="app-logo" />
      <h2 className="login-title">Login</h2>

      <form onSubmit={handleSubmit} className="login-form">
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="login-button">
          Login
        </button>
      </form>

      <p className="signup-link">
        Don’t have an account?{' '}
        <span
          className="link-text"
          onClick={() => navigate('/signup')}
          style={{ color: '#2B5528', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Sign up
        </span>
      </p>
    </div>
  );
}
