import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('UserEmail', email);
    formData.append('UserPassword', password);

    try {
      const response = await fetch('http://localhost:8000/api/Login/', {
        method: 'POST',
        body: formData,  // Send form data as body
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const responseData = await response.json();
      
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("username", responseData.username);  
      localStorage.setItem("userId", responseData.userId);     

      alert('Login successful!');
      navigate('/');
    } catch (error) {
      alert('Login error: ' + error.message);
    } 
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;
