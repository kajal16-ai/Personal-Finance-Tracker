import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6347', '#32CD32'];

const Report = () => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [categoryData, setCategoryData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [highestExpense, setHighestExpense] = useState(null);


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

  const fetchCategoryData = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const response = await axios.get(`http://localhost:8000/api/ExpenseByCategory/${userId}`);
      setCategoryData(response.data || []);
    } catch (error) {
      console.error("Failed to load category data:", error);
      setCategoryData("Error loading data. Please try again later.");
    }
  };

  const fetchMonthlyData = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const response = await axios.get(`http://localhost:8000/api/MonthlyIncomeExpense/${userId}`);
      setMonthlyData(response.data);
    } catch (error) {
      console.error("Failed to load monthly income/expense data:", error);
    }
  };

  const handleFilter = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    // Pie Chart Filter (by month)
    try {
      const pieRes = await axios.get(`http://localhost:8000/api/ExpenseByCategory/${userId}`);
      let filteredPie = pieRes.data;

      if (selectedMonth) {
        filteredPie = pieRes.data.filter(item => item.month === selectedMonth);
      }

      setCategoryData(filteredPie);

      if (filteredPie.length > 0) {
        const highest = filteredPie.reduce((prev, curr) => (prev.total > curr.total ? prev : curr));
        setHighestExpense(highest);
      } else {
        setHighestExpense(null);
      }

    } catch (error) {
      console.error("Error filtering Pie data:", error);
    }

    // Bar Chart Filter (by year)
    try {
      const barRes = await axios.get(`http://localhost:8000/api/MonthlyIncomeExpense/${userId}`);
      let filteredBar = barRes.data;

      if (selectedYear) {
        filteredBar = barRes.data.filter(item => item.year && item.year.toString() === selectedYear);
      }

      setMonthlyData(filteredBar);
    } catch (error) {
      console.error("Error filtering Bar data:", error);
    }
  };


  useEffect(() => {
    fetchTransactions();
    fetchCategoryData();
    fetchMonthlyData();
  }, []);

  const CurrentYear = new Date().getFullYear();
  const years = [];
  for (let i = CurrentYear; i >= CurrentYear - 10; i--) {
    years.push(i);
  }

  return (
    <div>
      <h2>📊 Finance Reports</h2>
      <div className="searchyearmonth">
        <select name="year" id="year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select name="month" id="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="">All Months</option>
          <option>January</option>
          <option>February</option>
          <option>March</option>
          <option>April</option>
          <option>May</option>
          <option>June</option>
          <option>July</option>
          <option>August</option>
          <option>September</option>
          <option>October</option>
          <option>November</option>
          <option>December</option>
        </select>
        <button onClick={handleFilter} className="searchbutton">
          Search
        </button>
        <Link to="/HigherExpense" state={{ highestExpense }} className="higher-expense-link">Higher Expense</Link>

      </div>

      <div className="Reportcards">
        <div className="reportcard income">
          <h3>Total Income</h3>
          <p>₹{income.toFixed(2)}</p>
        </div>
        <div className="reportcard expense">
          <h3>Total Expense</h3>
          <p>₹{expense.toFixed(2)}</p>
        </div>
        <div className="reportcard Netsaving">
          <h3>Net Savings</h3>
          <p>₹{balance.toFixed(2)}</p>
        </div>
      </div>
      <br></br>
      <h2>📊 Reports Overview</h2>
      <br></br>
      <div className="charts-container">
        <div className="chart-box">
          <h3>📈 Expense By Category</h3>
          <div style={{ width: "100%", height: 300 }}>
            {categoryData === null ? (<p>Loading expense data...</p>)
              : categoryData === "Error loading data. Please try again later." ? (<p>{categoryData}</p>)
                : categoryData.length === 0 ? (<p>No expense data available for this category.</p>)
                  : (
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={categoryData} dataKey="total" nameKey="category" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                          {categoryData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
          </div>
        </div>

        <div className="chart-box">
          <h3>📊 Monthly Income vs Expense</h3>
          <div style={{ width: "100%", height: 300 }}>
            {monthlyData.length === 0 ? (
              <p>Loading or no data available...</p>
            ) : (
              <ResponsiveContainer>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#82ca9d" name="Income" />
                  <Bar dataKey="expense" fill="#f87171" name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
