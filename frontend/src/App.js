import React, { useState } from 'react';
import './App.css';  // Import the stylesheet

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
    <div className="container">
      {/* To-Do List Section */}
      <section className="listSection">
        {tasks.length === 0 ? (
          <p className="empty">No tasks yet</p>
        ) : (
          <ul className="list">
            {tasks.map((t, i) => (
              <li key={i} className="item">{t}</li>
            ))}
          </ul>
        )}
      </section>

      {/* Input + Add Button */}
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
          Add
        </button>
      </div>
    </div>
  );
}