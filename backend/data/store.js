// In-memory database for bugs
let bugs = [];
let currentId = 1;

// Helper function to find bug by ID
const findBugById = (id) => {
  return bugs.find(bug => bug.id === parseInt(id));
};

// Helper function to find bug index by ID
const findBugIndexById = (id) => {
  return bugs.findIndex(bug => bug.id === parseInt(id));
};

// Validation helper
const validateBug = (bugData) => {
  const errors = [];

  if (!bugData.title || bugData.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (bugData.title.length > 100) {
    errors.push('Title cannot exceed 100 characters');
  }

  if (!bugData.description || bugData.description.trim().length === 0) {
    errors.push('Description is required');
  } else if (bugData.description.length > 500) {
    errors.push('Description cannot exceed 500 characters');
  }

  if (!bugData.reporter || bugData.reporter.trim().length === 0) {
    errors.push('Reporter is required');
  }

  if (bugData.priority && !['low', 'medium', 'high'].includes(bugData.priority)) {
    errors.push('Priority must be low, medium, or high');
  }

  if (bugData.status && !['open', 'in-progress', 'resolved'].includes(bugData.status)) {
    errors.push('Status must be open, in-progress, or resolved');
  }

  return errors;
};

// Function to get next ID
const getNextId = () => {
  return currentId++;
};

// Function to clear all bugs (for testing)
const clearBugs = () => {
  bugs.length = 0;
  currentId = 1;
};

// Function to initialize with sample data
const initializeSampleData = () => {
  if (bugs.length === 0) {
    bugs.push(
      {
        id: getNextId(),
        title: 'Login button not working',
        description: 'The login button on the homepage does nothing when clicked',
        status: 'open',
        priority: 'high',
        reporter: 'John Doe',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: getNextId(),
        title: 'Mobile responsive issues',
        description: 'The dashboard layout breaks on mobile devices',
        status: 'in-progress',
        priority: 'medium',
        reporter: 'Jane Smith',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    );
    console.log('Sample data initialized with', bugs.length, 'bugs');
  }
};

module.exports = {
  bugs,
  findBugById,
  findBugIndexById,
  validateBug,
  getNextId,
  clearBugs,
  initializeSampleData
};