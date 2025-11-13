import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BugForm from '../components/BugForm';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('BugForm Component', () => {
  it('renders form fields correctly', () => {
    render(<BugForm />);
    
    expect(screen.getByLabelText(/title:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/reporter:/i)).toBeInTheDocument();
    expect(screen.getByText(/report new bug/i)).toBeInTheDocument();
  });

  it('updates form fields when user types', async () => {
    const user = userEvent.setup();
    render(<BugForm />);
    
    const titleInput = screen.getByLabelText(/title:/i);
    await user.type(titleInput, 'Test Bug Title');
    
    expect(titleInput).toHaveValue('Test Bug Title');
  });

  it('submits form with correct data', async () => {
    const user = userEvent.setup();
    const mockOnBugAdded = jest.fn();
    const mockResponse = { data: { id: 1, title: 'Test Bug' } };
    
    axios.post.mockResolvedValue(mockResponse);
    
    render(<BugForm onBugAdded={mockOnBugAdded} />);
    
    // Fill form
    await user.type(screen.getByLabelText(/title:/i), 'Test Bug');
    await user.type(screen.getByLabelText(/description:/i), 'Test Description');
    await user.type(screen.getByLabelText(/reporter:/i), 'Test User');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /report bug/i }));
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/bugs',
        expect.objectContaining({
          title: 'Test Bug',
          description: 'Test Description',
          reporter: 'Test User'
        })
      );
    });
  });

  it('shows error message when submission fails', async () => {
    const user = userEvent.setup();
    axios.post.mockRejectedValue({
      response: { data: { message: 'Network error' } }
    });
    
    render(<BugForm />);
    
    await user.type(screen.getByLabelText(/title:/i), 'Test Bug');
    await user.type(screen.getByLabelText(/description:/i), 'Test Description');
    await user.type(screen.getByLabelText(/reporter:/i), 'Test User');
    
    await user.click(screen.getByRole('button', { name: /report bug/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });
});