import React from 'react';
import { useLocation } from 'react-router-dom';

const HigherExpense = () => {
  const location = useLocation();
  const highestExpense = location.state?.highestExpense;

  if (!highestExpense) {
    return (
      <div>
        <h2>📌 Highest Expense Detail</h2>
        <p>⚠️ No highest expense data available. Please apply filters from the Report page.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>📌 Highest Expense Detail</h2>
      <div className="expense-detail-card">
        <p><strong>Category:</strong> {highestExpense.category}</p>
        <p><strong>Total Amount:</strong> ₹{highestExpense.total.toFixed(2)}</p>
        {highestExpense.month && <p><strong>Month:</strong> {highestExpense.month}</p>}
      </div>
    </div>
  );
};

export default HigherExpense;
