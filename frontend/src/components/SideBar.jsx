import React from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="sidebar">
      <h2>💰 Finance Tracker</h2>
      <nav>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/add-transaction">Add Transaction</Link></li>
          <li><Link to="/transactions">Transactions</Link></li>
          <li><Link to="/Report">Report</Link></li>
          <li><Link to="/Settings">Settings</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;