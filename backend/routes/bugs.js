const express = require('express');
const router = express.Router();
const { 
  bugs, 
  findBugById, 
  findBugIndexById, 
  validateBug, 
  getNextId,
  initializeSampleData 
} = require('../data/store');

// Initialize sample data when the routes are loaded
initializeSampleData();

// GET all bugs
router.get('/', (req, res) => {
  console.log('GET /api/bugs - Returning', bugs.length, 'bugs');
  res.json(bugs);
});

// GET single bug
router.get('/:id', (req, res) => {
  const bug = findBugById(req.params.id);
  if (!bug) {
    return res.status(404).json({ message: 'Bug not found' });
  }
  res.json(bug);
});

// POST new bug
router.post('/', (req, res) => {
  console.log('POST /api/bugs - Received data:', req.body);

  // Validate input
  const errors = validateBug(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(', ') });
  }

  const newBug = {
    id: getNextId(),
    title: req.body.title.trim(),
    description: req.body.description.trim(),
    status: req.body.status || 'open',
    priority: req.body.priority || 'medium',
    reporter: req.body.reporter.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  bugs.push(newBug);
  console.log('Created new bug:', newBug);

  res.status(201).json(newBug);
});

// PUT update bug
router.put('/:id', (req, res) => {
  const bugIndex = findBugIndexById(req.params.id);
  if (bugIndex === -1) {
    return res.status(404).json({ message: 'Bug not found' });
  }

  // Validate input
  const errors = validateBug(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(', ') });
  }

  const updatedBug = {
    ...bugs[bugIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  // Ensure ID doesn't change
  updatedBug.id = bugs[bugIndex].id;

  bugs[bugIndex] = updatedBug;
  console.log('Updated bug:', updatedBug);

  res.json(updatedBug);
});

// DELETE bug
router.delete('/:id', (req, res) => {
  const bugIndex = findBugIndexById(req.params.id);
  if (bugIndex === -1) {
    return res.status(404).json({ message: 'Bug not found' });
  }

  const deletedBug = bugs.splice(bugIndex, 1)[0];
  console.log('Deleted bug:', deletedBug);

  res.json({ message: 'Bug deleted successfully', deletedBug });
});

module.exports = router;