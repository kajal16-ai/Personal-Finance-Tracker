import React from "react";
import './app.css';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import SideBar from './components/SideBar';
import TopBar from './components/TopBar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransaction";
import Transaction from "./pages/Transaction";
import Settings from "./pages/Settings";
import Report from "./pages/Report";
import HigherExpense from './pages/HigherExpense';

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login" || location.pathname === "/register";
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (isLoginPage && isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  if (!isAuthenticated && !isLoginPage) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app-layout">
      {isAuthenticated && (
        <>
          <SideBar />
          <div className="main-area">
            <TopBar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-transaction" element={<AddTransaction />} />
              <Route path="/transactions" element={<Transaction />} />
              <Route path="/Settings" element={<Settings />} />
              <Route path="/report" element={<Report />} />
              <Route path="/HigherExpense" element={<HigherExpense />} />
            </Routes>
          </div>
        </>
      )}
      {!isAuthenticated && (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
