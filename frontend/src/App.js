
import React, { useState } from 'react';
import './App.css';
import TaskList from './TaskList';
import ChatGPTAPI from './ChatGPTAPI';


export default function App() {
  // Store tasks as objects: { text, original, priority, aiRefined }
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('YOUR_OPENAI_API_KEY'); // Replace with your key for testing

  // Add a new task (unrefined)
  const handleAdd = () => {
    if (!taskText.trim()) return;
    setTasks([...tasks, { text: taskText.trim(), original: taskText.trim(), priority: null, aiRefined: false }]);
    setTaskText('');
  };

  // AI Refine all tasks
  const handleAIRefine = async () => {
    setLoading(true);
    setError('');
    try {
      const api = new ChatGPTAPI(apiKey);
      const originals = tasks.map(t => t.text);
      const aiResults = await api.refineTasks(originals);
      // Map AI results back to tasks
      const newTasks = aiResults.map((ai, i) => ({
        text: ai.text,
        original: ai.original,
        priority: ai.priority,
        aiRefined: true
      }));
      setTasks(newTasks.sort((a, b) => a.priority - b.priority));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Undo AI refinement for all tasks
  const handleUndo = () => {
    setTasks(tasks.map(t => ({
      text: t.original,
      original: t.original,
      priority: null,
      aiRefined: false
    })));
  };

  // Change priority for a task
  const handlePriorityChange = (idx, newPriority) => {
    setTasks(tasks => tasks.map((t, i) =>
      i === idx ? { ...t, priority: newPriority } : t
    ).sort((a, b) => (a.priority || 10) - (b.priority || 10)));
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
        <button onClick={handleAIRefine} className="button" disabled={loading || tasks.length === 0}>
          <span className="bi bi-stars" aria-label="AI Refine"></span> AI Refine
        </button>
        <button onClick={handleUndo} className="button" disabled={loading || tasks.every(t => !t.aiRefined)}>
          <span className="bi bi-arrow-counterclockwise" aria-label="Undo"></span> Undo
        </button>
      </div>
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      <section className="listSection">
        <TaskList
          tasks={tasks}
          onPriorityChange={handlePriorityChange}
        />
        {loading && <div className="empty">Refining tasks with AI...</div>}
      </section>
      <footer className="footer">
        &copy; {new Date().getFullYear()} STARKSERVICES
      </footer>
    </div>
  );
}