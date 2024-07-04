import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Registration() {
  let navigate = useNavigate();

  const [registration, setRegistration] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    sex: '',
  });

  const [error, setError] = useState('');

  const { username, email, password, fullName, sex } = registration;

  const onInputChange = (e) => {
    setRegistration({ ...registration, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/registration', registration);
      // Обработка успешной регистрации, например, перенаправление пользователя на страницу входа
      navigate('/login');
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      if (error.response && error.response.status === 500) {
        setError('This username is already in use. Please choose a different username.');
      } else {
        setError('An error occurred during registration. Please try again.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form style={{ width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }} onSubmit={onSubmit}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Registration</h2>
        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="fullName">Full Name:</label>
          <input
            style={{ width: '100%', padding: '5px', borderRadius: '3px', border: '1px solid #ccc' }}
            type="text"
            id="fullName"
            name="fullName"
            required
            value={fullName}
            onChange={onInputChange}
            placeholder="Enter your full name"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="email">Email:</label>
          <input
            style={{ width: "100%", padding: "5px", borderRadius: "3px", border: "1px solid #ccc" }}
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={onInputChange}
            placeholder="Enter your email"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="username">Username:</label>
          <input
            style={{ width: "100%", padding: "5px", borderRadius: "3px", border: "1px solid #ccc" }}
            type="text"
            id="username"
            name="username"
            required
            value={username}
            onChange={onInputChange}
            placeholder="Enter your username"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="password">Password:</label>
          <input
            style={{ width: "100%", padding: "5px", borderRadius: "3px", border: "1px solid #ccc" }}
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={onInputChange}
            placeholder="Enter your password"
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="sex">Sex:</label>
          <select
            style={{ width: "100%", padding: "5px", borderRadius: "3px", border: "1px solid #ccc" }}
            id="sex"
            name="sex"
            required
            value={sex}
            onChange={onInputChange}
          >
            <option value="">Select your sex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '3px',
            border: 'none',
            backgroundColor: '#4CAF50',
            color: 'white',
          }}
          type="submit"
        >
          Register
        </button>
        <p style={{ marginTop: '10px', textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}