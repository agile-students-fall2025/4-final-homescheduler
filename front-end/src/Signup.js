import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import logo from './logo.png';
import { FaEye, FaEyeSlash } from "react-icons/fa";

export function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    special: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validate password in real time
  const validatePassword = (pw) => {
    setPasswordChecks({
      length: pw.length >= 8,
      uppercase: /[A-Z]/.test(pw),
      lowercase: /[a-z]/.test(pw),
      special: /[^A-Za-z0-9]/.test(pw)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Prevent weak passwords
    const allChecksPassed = Object.values(passwordChecks).every(Boolean);
    if (!allChecksPassed) {
      alert("Your password does not meet all requirements.");
      return;
    }

    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
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

  const strengthPercent =
    Object.values(passwordChecks).filter(Boolean).length * 25;

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
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ?  <FaEyeSlash /> : <FaEye />}
          </span>
        </div>


        {/* Password Checklist */}
        <div className="password-checklist">
          <p className={passwordChecks.length ? "valid" : "invalid"}>
            • At least 8 characters
          </p>
          <p className={passwordChecks.uppercase ? "valid" : "invalid"}>
            • At least one uppercase letter
          </p>
          <p className={passwordChecks.lowercase ? "valid" : "invalid"}>
            • At least one lowercase letter
          </p>
          <p className={passwordChecks.special ? "valid" : "invalid"}>
            • At least one special character (!@#$ etc.)
          </p>
        </div>

        {/* Strength Bar */}
        <div className="strength-bar">
          <div
            className="strength-fill"
            style={{ width: `${strengthPercent}%` }}
          ></div>
        </div>

        <label>Confirm Password</label>
        <div className="password-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <span
            className="toggle-password"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ?  <FaEyeSlash /> : <FaEye />}
          </span>
        </div>


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
