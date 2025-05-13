import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!image) {
      alert('Please upload an image!');
      return;
    }

    const formData = new FormData();
    formData.append('UserName', username);
    formData.append('UserEmail', email);
    formData.append('UserPassword', password);
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:8000/api/Register/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('User registered successfully!');
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      console.error('Registration failed:', error.response?.data); 
      alert(`Registration failed: ${errorMessage}`);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setImage(e.target.files[0])} 
            required 
          />
          <button type="submit">Register</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
