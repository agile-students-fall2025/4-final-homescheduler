import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import logo from './logo.png';

export function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="login-container">
      <img src={logo} alt="App Logo" className="app-logo" />
      <h2 className="login-title">Sign Up</h2>

      <form className="login-form" onSubmit={handleSubmit}>
        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          placeholder="Enter first name"
          value={formData.firstName}
          onChange={handleChange}
        />

        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          placeholder="Enter last name"
          value={formData.lastName}
          onChange={handleChange}
        />

        
        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
        />

        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <button type="submit" className="login-button">
          Sign Up
        </button>
      </form>

      <p className="signup-link">
        Already have an account?{' '}
        <a href="/" className="login-link-text">
          Log in here
        </a>
      </p>
    </div>
  );
}
