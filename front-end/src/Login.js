import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './logo.png';
import './Login.css'; 
import { FaEye, FaEyeSlash } from "react-icons/fa";

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.user.token);

      navigate("/home");
    } 
    catch (err) {
      alert("Server not responding");
      console.error(err);
    }
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
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="toggle-password"
            onClick={() => setShowPassword(prev => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

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
