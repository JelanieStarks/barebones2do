import { render, screen } from '@testing-library/react';
import App from './App';

test('renders empty state message', () => {
  render(<App />);
  const emptyMsg = screen.getByText(/no tasks yet/i);
  expect(emptyMsg).toBeInTheDocument();
});
