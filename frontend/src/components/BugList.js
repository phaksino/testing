import React from 'react';
import axios from 'axios';

const BugList = ({ bugs, onBugUpdated, onBugDeleted }) => {
  const handleStatusChange = async (bugId, newStatus) => {
    try {
      console.log(`Updating bug ${bugId} to status: ${newStatus}`); // Debugging
      const response = await axios.put(`http://localhost:5000/api/bugs/${bugId}`, {
        status: newStatus
      });
      console.log('Bug updated:', response.data); // Debugging
      onBugUpdated(response.data);
    } catch (error) {
      console.error('Error updating bug:', error); // Debugging
      alert('Failed to update bug status');
    }
  };

  const handleDelete = async (bugId) => {
    if (window.confirm('Are you sure you want to delete this bug?')) {
      try {
        console.log(`Deleting bug ${bugId}`); // Debugging
        await axios.delete(`http://localhost:5000/api/bugs/${bugId}`);
        console.log('Bug deleted successfully'); // Debugging
        onBugDeleted(bugId);
      } catch (error) {
        console.error('Error deleting bug:', error); // Debugging
        alert('Failed to delete bug');
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'open': return 'status-open';
      case 'in-progress': return 'status-in-progress';
      case 'resolved': return 'status-resolved';
      default: return '';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  if (bugs.length === 0) {
    return (
      <div className="bug-list">
        <h2>Reported Bugs</h2>
        <p>No bugs reported yet.</p>
      </div>
    );
  }

  return (
    <div className="bug-list">
      <h2>Reported Bugs ({bugs.length})</h2>
      {bugs.map(bug => (
        <div key={bug._id} className="bug-item">
          <h3>{bug.title}</h3>
          <p>{bug.description}</p>
          <div style={{ marginBottom: '10px' }}>
            <span className={`bug-status ${getStatusClass(bug.status)}`}>
              {bug.status.toUpperCase()}
            </span>
            <span className={getPriorityClass(bug.priority)}>
              Priority: {bug.priority}
            </span>
          </div>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
            Reported by: {bug.reporter} | 
            Created: {new Date(bug.createdAt).toLocaleDateString()}
          </div>
          <div>
            <label>Change Status: </label>
            <select
              value={bug.status}
              onChange={(e) => handleStatusChange(bug._id, e.target.value)}
              style={{ marginRight: '10px' }}
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            
            <button
              onClick={() => handleDelete(bug._id)}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BugList;