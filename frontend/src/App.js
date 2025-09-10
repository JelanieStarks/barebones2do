
import React, { useState, useEffect } from 'react';
import './App.css';
import TaskList from './TaskList';
import ChatGPTAPI from './ChatGPTAPI';

// Local storage helper functions
const loadTasks = () => {
  try {
    const saved = localStorage.getItem('barebones2do-tasks');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveTasks = (tasks) => {
  try {
    localStorage.setItem('barebones2do-tasks', JSON.stringify(tasks));
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }
};

const loadArchivedTasks = () => {
  try {
    const saved = localStorage.getItem('barebones2do-archived');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveArchivedTasks = (archivedTasks) => {
  try {
    localStorage.setItem('barebones2do-archived', JSON.stringify(archivedTasks));
  } catch (e) {
    console.warn('Could not save archived tasks to localStorage:', e);
  }
};

export default function App() {
  // Store tasks as objects: { text, original, priority, aiRefined, id, completed }
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState(loadTasks);
  const [archivedTasks, setArchivedTasks] = useState(loadArchivedTasks);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKey] = useState('YOUR_OPENAI_API_KEY'); // Replace with your key for testing

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Save archived tasks to localStorage whenever archived tasks change
  useEffect(() => {
    saveArchivedTasks(archivedTasks);
  }, [archivedTasks]);

  // Add a new task (unrefined)
  const handleAdd = () => {
    if (!taskText.trim()) return;
    const newTask = {
      id: Date.now(),
      text: taskText.trim(),
      original: taskText.trim(),
      priority: null,
      aiRefined: false,
      completed: false
    };
    setTasks([...tasks, newTask]);
    setTaskText('');
  };

  // Complete a task and move to archive
  const handleComplete = (taskId) => {
    const taskToComplete = tasks.find(task => task.id === taskId);
    if (taskToComplete) {
      const completedTask = {
        ...taskToComplete,
        completed: true,
        completedAt: new Date().toISOString()
      };
      setArchivedTasks([...archivedTasks, completedTask]);
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  // Delete a task permanently
  const handleDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // AI Refine all tasks with fallback when offline
  const handleAIRefine = async () => {
    setLoading(true);
    setError('');
    try {
      const api = new ChatGPTAPI(apiKey);
      const originals = tasks.map(t => t.text);
      const aiResults = await api.refineTasks(originals);
      // Map AI results back to tasks
      const newTasks = aiResults.map((ai, i) => ({
        ...tasks[i],
        text: ai.text,
        original: ai.original,
        priority: ai.priority,
        aiRefined: true
      }));
      setTasks(newTasks.sort((a, b) => a.priority - b.priority));
    } catch (e) {
      // AI fallback - simple local prioritization when offline
      setError('AI unavailable - using local fallback');
      const fallbackTasks = tasks.map(task => ({
        ...task,
        text: task.text.replace(/\bi want\b/gi, 'I desire').replace(/\bneed to\b/gi, 'I will'),
        priority: task.text.length > 20 ? 1 : task.text.includes('urgent') ? 1 : 2,
        aiRefined: true
      }));
      setTasks(fallbackTasks.sort((a, b) => a.priority - b.priority));
    } finally {
      setLoading(false);
    }
  };

  // Undo AI refinement for all tasks
  const handleUndo = () => {
    setTasks(tasks.map(t => ({
      ...t,
      text: t.original,
      priority: null,
      aiRefined: false
    })));
  };

  // Change priority for a task
  const handlePriorityChange = (taskId, newPriority) => {
    setTasks(tasks => tasks.map(t =>
      t.id === taskId ? { ...t, priority: newPriority } : t
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
        <button onClick={() => setShowArchived(!showArchived)} className="button">
          <span className="bi bi-archive" aria-label="Archive"></span> 
          {showArchived ? 'Show Active' : `Archive (${archivedTasks.length})`}
        </button>
      </div>
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      <section className="listSection">
        {showArchived ? (
          <div>
            <h3>Archived Tasks</h3>
            {archivedTasks.length === 0 ? (
              <div className="empty">No completed tasks yet</div>
            ) : (
              archivedTasks.map(task => (
                <div key={task.id} className="task completed">
                  <span className="bi bi-check-circle-fill text-success me-2"></span>
                  <span className="task-text">{task.text}</span>
                  {task.priority && <span className={`badge priority-${task.priority}`}>
                    {task.priority === 1 ? 'Hot' : task.priority === 2 ? 'Warm' : 'Cold'}
                  </span>}
                  <small className="text-muted ms-2">
                    Completed: {new Date(task.completedAt).toLocaleDateString()}
                  </small>
                </div>
              ))
            )}
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onPriorityChange={handlePriorityChange}
            onComplete={handleComplete}
            onDelete={handleDelete}
          />
        )}
        {loading && <div className="empty">Refining tasks with AI...</div>}
      </section>
      <footer className="footer">
        &copy; {new Date().getFullYear()} STARKSERVICES
      </footer>
    </div>
  );
}