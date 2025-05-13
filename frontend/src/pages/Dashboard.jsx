import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  
import DashboardCards from "../components/DashboardCards";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null); 
  const navigate = useNavigate();  

  const fetchTransactions = useCallback(async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.warn("No userId found in localStorage.");
      navigate("/login"); 
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/api/GetTransactions/${userId}/`);
      if (response.data) {
        setTransactions(response.data);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Failed to load transactions:", error);
      setError("Failed to load transactions. Please try again later.");
    }
  }, [navigate]);  

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="content">
      <DashboardCards />
      <br />
      <br />
      <section className="recent-transactions">
        <h2>Recent Transactions</h2>
        {error && <div className="error-message">{error}</div>} {/* Show error message if any */}
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((txn, index) => (
                <tr key={index}>
                  <td>{txn.date}</td>
                  <td>{txn.category}</td>
                  <td>{txn.type}</td>
                  <td>₹{txn.amount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Dashboard;
