import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddTransaction = () => {
  const [formData, setFormData] = useState({
    date: '',
    type: '',
    category: '',
    amount: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId'); // Getting userId from localStorage

    if (!userId) {
      alert("User not logged in. Please login again.");
      return;
    }

    if (formData.amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const transactionData = {
      userId,
      date: formData.date,
      type: formData.type,
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
    };

    try {
      setLoading(true);

      const res = await axios.post('http://localhost:8000/api/AddTransaction/', transactionData, {
      });

      alert(res.data.message || "Transaction added successfully!");
      navigate('/'); 
      setFormData({ date: '', type: '', category: '', amount: '', description: '' });
    } catch (error) {
      alert("Error adding transaction: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="add-transaction">
      <h2>Add New Transaction</h2>
      <form className="transaction-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input type="date" id="date" value={formData.date} onChange={handleChange} required/>
        </div>

        <div className="form-group">
          <label htmlFor="type">Type</label>
          <select id="type" value={formData.type} onChange={handleChange} required>
            <option value="">Select Type</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input type="text" id="category" placeholder="e.g., Food, Salary, Shopping" value={formData.category} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (₹)</label>
          <input type="number" id="amount" placeholder="Enter amount" value={formData.amount} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" placeholder="Optional details" value={formData.description} onChange={handleChange}></textarea>
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Adding..." : "Add Transaction"}
        </button>
      </form>
    </section>
  );
};

export default AddTransaction;
