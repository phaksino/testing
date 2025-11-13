import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from '../App';

jest.mock('axios');

describe('Bug List Integration', () => {
  it('loads and displays bugs from API', async () => {
    const mockBugs = [
      { id: 1, title: 'Bug 1', status: 'open', reporter: 'User 1' },
      { id: 2, title: 'Bug 2', status: 'in-progress', reporter: 'User 2' }
    ];
    
    axios.get.mockResolvedValue({ data: mockBugs });
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Bug 1')).toBeInTheDocument();
      expect(screen.getByText('Bug 2')).toBeInTheDocument();
    });
  });
});