import React from 'react';
// Example test for Vitest + React Testing Library
import { render, screen } from '@testing-library/react';
import App from './App.jsx';

describe('App', () => {
  it('renders Pet Adoption heading', () => {
    render(<App />);
    expect(screen.getByText(/Pet Adoption/i)).toBeInTheDocument();
  });
});