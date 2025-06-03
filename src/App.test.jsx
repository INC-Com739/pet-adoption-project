const React = require('react');
const { render, screen } = require('@testing-library/react');
const App = require('./App.jsx').default;

test('renders Pet Adoption heading', () => {
  render(<App />);
  expect(screen.getByText(/Pet Adoption/i)).toBeInTheDocument();
});
