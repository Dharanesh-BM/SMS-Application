import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:1846/login', {
        phoneNumber,
        password
      });
      
      if (response.data.message === 'Login successful') {
        onLogin(response.data.user.name);
      }
    } catch (error) {
      setError('Invalid phone number or password. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Welcome Back!</h2>
        {error && <p className="error-message">{error}</p>}
        <input 
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          pattern="\d{10}"
          title="Please enter a valid 10-digit phone number"
          required 
        />
        <input 
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <button type="submit">Login</button>
        <p className="switch-form">
          Don't have an account? 
          <button type="button" onClick={onSwitchToRegister}>Register</button>
        </p>
      </form>
    </div>
  );
};

export default Login;
