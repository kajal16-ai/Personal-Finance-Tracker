import React from "react";
import { useNavigate } from 'react-router-dom';

const TopBar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username")
    navigate("/login");
  };
  
  const username=localStorage.getItem("username") || "user";
  return (
    <div className="top-bar">
      <div className="user">Welcome, {username} 👋</div>
      <button className="btn-logout" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default TopBar;