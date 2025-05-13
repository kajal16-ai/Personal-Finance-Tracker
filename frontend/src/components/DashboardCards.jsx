import React, { useEffect, useState } from "react";
import axios from "axios";

const DashboardCards = () => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const res = await axios.get(`http://localhost:8000/api/GetTransactions/${userId}`);
        const data = res.data;

        let totalIncome = 0;
        let totalExpense = 0;

        data.forEach((txn) => {
          const amount = parseFloat(txn.amount);
          if (txn.type === "Income") totalIncome += amount;
          else if (txn.type === "Expense") totalExpense += amount;
        });

        setIncome(totalIncome);
        setExpense(totalExpense);
        setBalance(totalIncome - totalExpense);
      } catch (error) {
        console.error("Failed to load transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="cards">
      <div className="card balance">
        <h3>Current Balance</h3>
        <p>₹{balance.toFixed(2)}</p>
      </div>
      <div className="card income">
        <h3>Total Income</h3>
        <p>₹{income.toFixed(2)}</p>
      </div>
      <div className="card expense">
        <h3>Total Expense</h3>
        <p>₹{expense.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default DashboardCards;


