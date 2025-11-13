import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorBoundary from './components/ErrorBoundary';
import BugForm from './components/BugForm';
import BugList from './components/BugList';
import './App.css';

// Axios configuration with better error handling
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
});

function App() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');

  const checkBackendHealth = async () => {
    try {
      console.log('Checking backend health...');
      const response = await api.get('/health');
      console.log('Backend health:', response.data);
      setBackendStatus('connected');
      return true;
    } catch (err) {
      console.error('Backend health check failed:', err);
      setBackendStatus('disconnected');
      return false;
    }
  };

  const fetchBugs = async () => {
    try {
      setLoading(true);
      console.log('Fetching bugs...');
      
      // First check if backend is available
      const isBackendHealthy = await checkBackendHealth();
      
      if (!isBackendHealthy) {
        setError('Backend server is not available. Please make sure the backend is running on port 5000.');
        setLoading(false);
        return;
      }

      const response = await api.get('/bugs');
      console.log('Bugs fetched successfully:', response.data);
      setBugs(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching bugs:', err);
      
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to backend server. Please ensure the backend is running on http://localhost:5000');
      } else if (err.response) {
        setError(`Server error: ${err.response.status} - ${err.response.data.message}`);
      } else {
        setError('Failed to load bugs. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  const handleBugAdded = (newBug) => {
    console.log('New bug added, refreshing list...');
    setBugs(prevBugs => [newBug, ...prevBugs]);
  };

  const handleBugUpdated = (updatedBug) => {
    setBugs(prevBugs =>
      prevBugs.map(bug =>
        bug._id === updatedBug._id ? updatedBug : bug
      )
    );
  };

  const handleBugDeleted = (bugId) => {
    setBugs(prevBugs => prevBugs.filter(bug => bug._id !== bugId));
  };

  return (
    <ErrorBoundary>
      <div className="container">
        <h1>Bug Tracker</h1>
        
        {/* Backend Status Indicator */}
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '4px',
          backgroundColor: backendStatus === 'connected' ? '#d4edda' : 
                          backendStatus === 'disconnected' ? '#f8d7da' : '#fff3cd',
          color: backendStatus === 'connected' ? '#155724' : 
                backendStatus === 'disconnected' ? '#721c24' : '#856404',
          border: `1px solid ${
            backendStatus === 'connected' ? '#c3e6cb' : 
            backendStatus === 'disconnected' ? '#f5c6cb' : '#ffeaa7'
          }`
        }}>
          Backend Status: 
          <strong>
            {backendStatus === 'connected' ? ' ✅ Connected' : 
             backendStatus === 'disconnected' ? ' ❌ Disconnected' : ' ⏳ Checking...'}
          </strong>
        </div>
        
        <BugForm onBugAdded={handleBugAdded} />
        
        {loading && <p>Loading bugs...</p>}
        {error && (
          <div className="error">
            {error}
            <button 
              onClick={fetchBugs}
              style={{ marginLeft: '10px', padding: '5px 10px' }}
            >
              Retry
            </button>
          </div>
        )}
        
        {!loading && !error && (
          <BugList
            bugs={bugs}
            onBugUpdated={handleBugUpdated}
            onBugDeleted={handleBugDeleted}
          />
        )}

        {/* Debugging section */}
        <div style={{ marginTop: '20px', padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>
          <h3>Debug Info:</h3>
          <p>Backend URL: {API_BASE_URL}</p>
          <p>Total bugs: {bugs.length}</p>
          <p>Backend status: {backendStatus}</p>
          <button onClick={() => console.log('Current bugs:', bugs)}>
            Log Bugs to Console
          </button>
          <button onClick={fetchBugs} style={{ marginLeft: '10px' }}>
            Refresh Bugs
          </button>
          <button onClick={checkBackendHealth} style={{ marginLeft: '10px' }}>
            Check Backend Health
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;