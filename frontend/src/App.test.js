
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

import ChatGPTAPI from './ChatGPTAPI';
// Mock fetch for ChatGPTAPI
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      choices: [
        {
          message: {
            content: JSON.stringify([
              {
                text: "I have confidently achieved mastery of React.",
                priority: 2,
                original: "Mastered React."
              }
            ])
          }
        }
      ]
    })
  })
);

test('ChatGPTAPI refines tasks and returns AI results', async () => {
  const api = new ChatGPTAPI('test-key');
  const result = await api.refineTasks(["Master React"]);
  expect(result).toEqual([
    {
      text: "I have confidently achieved mastery of React.",
      priority: 2,
      original: "Mastered React."
    }
  ]);
});

test('renders empty state message', () => {
  render(<App />);
  const emptyMsg = screen.getByText(/no tasks yet/i);
  expect(emptyMsg).toBeInTheDocument();
});

test('adds a task and displays it', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/enter a new task/i);
  const addButton = screen.getByRole('button', { name: /add/i });
  fireEvent.change(input, { target: { value: 'Test Task' } });
  fireEvent.click(addButton);
  expect(screen.getByText('Test Task')).toBeInTheDocument();
});

test('input clears after adding a task', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/enter a new task/i);
  const addButton = screen.getByRole('button', { name: /add/i });
  fireEvent.change(input, { target: { value: 'Another Task' } });
  fireEvent.click(addButton);
  expect(input.value).toBe('');
});

test('multiple tasks appear in order', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/enter a new task/i);
  const addButton = screen.getByRole('button', { name: /add/i });
  fireEvent.change(input, { target: { value: 'First Task' } });
  fireEvent.click(addButton);
  fireEvent.change(input, { target: { value: 'Second Task' } });
  fireEvent.click(addButton);
  const items = screen.getAllByRole('listitem');
  expect(items[0]).toHaveTextContent('First Task');
  expect(items[1]).toHaveTextContent('Second Task');
});

test('shows copyright footer', () => {
  render(<App />);
  expect(screen.getByText(/starkservices/i)).toBeInTheDocument();
});
