import React, { useState } from 'react';
import axios from 'axios';
// import './Registration.css';

const Registration = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    aadharNumber: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [generatedPhone, setGeneratedPhone] = useState('');

  const generatePhoneNumber = () => {
    // Generate a 10-digit phone number starting with 9, 8, or 7
    const prefix = ['9', '8', '7'][Math.floor(Math.random() * 3)];
    const remaining = Math.floor(Math.random() * 9000000000 + 1000000000).toString().slice(1);
    return prefix + remaining;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.aadharNumber.length !== 12) {
      setError('Aadhar number must be 12 digits');
      return;
    }

    const phoneNumber = generatePhoneNumber();
    setGeneratedPhone(phoneNumber);

    try {
      const response = await axios.post('http://localhost:1846/register', {
        ...formData,
        phoneNumber
      });

      if (response.data.message === 'User registered successfully') {
        alert(`Registration successful! Your phone number is: ${phoneNumber}`);
        onSwitchToLogin(); // Switch to login view
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="registration-container">
      <form onSubmit={handleSubmit} className="registration-form">
        <h2>Create Account</h2>
        {error && <p className="error-message">{error}</p>}
        
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <input
          type="text"
          name="aadharNumber"
          placeholder="Aadhar Number (12 digits)"
          value={formData.aadharNumber}
          onChange={handleChange}
          pattern="\d{12}"
          required
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {generatedPhone && (
          <div className="phone-number-display">
            Your Phone Number: {generatedPhone}
          </div>
        )}

        <button type="submit">Register</button>
        <p className="switch-form">
          Already have an account? <button type="button" onClick={onSwitchToLogin}>Login</button>
        </p>
      </form>
    </div>
  );
};

export default Registration;