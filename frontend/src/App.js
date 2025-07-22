import React, { useState } from 'react';
import './App.css';
import TaskList from './TaskList';

export default function App() {
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState([]);

  const handleAdd = () => {
    if (!taskText.trim()) return;
    setTasks([...tasks, taskText.trim()]);
    setTaskText('');
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>barebones2do</h1>
      </header>
      <div className="inputSection">
        <input
          type="text"
          value={taskText}
          onChange={e => setTaskText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a new task"
          className="input"
        />
        <button onClick={handleAdd} className="button">
          <span className="bi bi-plus" aria-label="Add"></span> Add
        </button>
      </div>
      <section className="listSection">
        <TaskList tasks={tasks} />
      </section>
      <footer className="footer">
        &copy; {new Date().getFullYear()} STARKSERVICES
      </footer>
    </div>
  );
}