import React, { useEffect, useState } from "react";
import axios from "axios";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    axios.get(`http://localhost:8000/api/GetAllTransactions/${userId}/`)
      .then((response) => {
        setTransactions(response.data);
        setFilteredTransactions(response.data);
      })
      .catch((error) => {
        console.error("Failed to load transactions:", error);
      });
  }, []);

  const handleFilter = () => {
    let filtered = transactions;

    if (selectedDate) {
      filtered = filtered.filter((txn) => txn.date === selectedDate);
    }

    if (selectedMonth) {
      filtered = filtered.filter((txn) => {
        const txnMonth = new Date(txn.date).getMonth() + 1;
        return txnMonth === parseInt(selectedMonth);
      });
    }

    setFilteredTransactions(filtered);
  };

  const formatDate = (dateStr) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  return (
    <div className="content">
      <section className="recent-transactions">
        <div className="transactions-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Transaction History</h2>
          <div className="filters" style={{ display: "flex", gap: "10px" }}>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              <option value="">Month</option>
              <option value="01">January</option>
              <option value="02">February</option>
              <option value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
            <button onClick={handleFilter}>Search</button>
          </div>
        </div>

        <div className="scrollable-table">
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
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn, index) => (
                  <tr key={index}>
                    <td>{formatDate(txn.date)}</td>
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
        </div>
      </section>
    </div>
  );
};

export default Transaction;
