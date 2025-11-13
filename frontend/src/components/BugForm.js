import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const BugForm = ({ onBugAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    reporter: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    console.log('Form field changed:', e.target.name, e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Submitting bug:', formData);
      const response = await api.post('/bugs', formData);
      console.log('Bug created successfully:', response.data);
      
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        reporter: ''
      });
      
      if (onBugAdded) {
        onBugAdded(response.data);
      }
    } catch (err) {
      console.error('Error creating bug:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to backend server. Please ensure the backend is running.');
      } else {
        setError(err.response?.data?.message || 'Failed to create bug');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bug-form">
      <h2>Report New Bug</h2>
      
      {error && <div className="error">{error}</div>}
      
      <div>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          maxLength={100}
        />
      </div>
      
      <div>
        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          maxLength={500}
        />
      </div>
      
      <div>
        <label>Priority:</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      
      <div>
        <label>Reporter:</label>
        <input
          type="text"
          name="reporter"
          value={formData.reporter}
          onChange={handleChange}
          required
        />
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Reporting...' : 'Report Bug'}
      </button>
    </form>
  );
};

export default BugForm;