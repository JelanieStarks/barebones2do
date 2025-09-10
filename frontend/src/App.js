
import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import TaskList from './TaskList';
import ChatGPTAPI from './ChatGPTAPI';


export default function App() {
  // Store tasks as objects: { text, original, priority, aiRefined }
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('bb2.tasks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [archive, setArchive] = useState(() => {
    try {
      const saved = localStorage.getItem('bb2.archive');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState(''); // provide via UI if desired
  const [showGoalPrompt, setShowGoalPrompt] = useState(false);
  const [goalText, setGoalText] = useState('');
  const [feedback, setFeedback] = useState(() => {
    try { return localStorage.getItem('bb2.feedback') || ''; } catch { return ''; }
  });

  // Persist tasks and archive
  useEffect(() => {
    try { localStorage.setItem('bb2.tasks', JSON.stringify(tasks)); } catch {}
  }, [tasks]);
  useEffect(() => {
    try { localStorage.setItem('bb2.archive', JSON.stringify(archive)); } catch {}
  }, [archive]);

  // Daily goals prompt
  useEffect(() => {
    const last = localStorage.getItem('bb2.lastGoalDate');
    const today = new Date().toDateString();
    if (last !== today) setShowGoalPrompt(true);
  }, []);

  // Derived stats
  const completedCount = useMemo(() => archive.length, [archive]);

  const handleRecordGoals = () => {
    const today = new Date().toISOString();
    try {
      const existing = JSON.parse(localStorage.getItem('bb2.goals') || '[]');
      existing.unshift({ at: today, text: goalText });
      localStorage.setItem('bb2.goals', JSON.stringify(existing));
      localStorage.setItem('bb2.lastGoalDate', new Date().toDateString());
    } catch {}
    setGoalText('');
    setShowGoalPrompt(false);
  };

  const handleSaveFeedback = () => {
    try { localStorage.setItem('bb2.feedback', feedback); } catch {}
  };

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
      let newTasks;
      const originals = tasks.map(t => t.text);
      if (apiKey) {
        const api = new ChatGPTAPI(apiKey);
        const aiResults = await api.refineTasks(originals);
        newTasks = aiResults.map(ai => ({
          text: ai.text,
          original: ai.original,
          priority: ai.priority,
          aiRefined: true
        }));
      } else {
        // Offline/local fallback: simple heuristic priority + past-tense-ish rewrite
        newTasks = originals.map((t) => {
          const lower = t.toLowerCase();
          let priority = 5;
          if (/\b(today|urgent|asap|now|immediately)\b/.test(lower)) priority = 1;
          else if (/\b(important|goal|deadline|must)\b/.test(lower)) priority = 2;
          else if (/\b(weekly|this week|soon)\b/.test(lower)) priority = 3;
          const text = `I have successfully ${t.replace(/^to\s+/i, '').replace(/\bi want\b/ig, 'I desire to')}.`;
          const original = t.replace(/^(I\s+)?(will|want to|need to|to)\s*/i, '').replace(/\.$/, '');
          return { text, priority, original: `${original}.`, aiRefined: true };
        });
      }
      setTasks(newTasks.sort((a, b) => (a.priority || 10) - (b.priority || 10)));
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

  // Archive checked tasks: move to archive and remove from list
  const handleArchiveChecked = (checkedIndices) => {
    const toArchive = tasks.filter((_, i) => checkedIndices.includes(i));
    if (toArchive.length === 0) return;
    setArchive(prev => [...toArchive, ...prev]);
    setTasks(tasks.filter((_, i) => !checkedIndices.includes(i)));
  };

  const handleClearArchive = () => setArchive([]);

  const handleKeyDown = e => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>barebones2do</h1>
        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Completed today: {completedCount}</div>
      </header>
      <div className="inputSection">
        {showGoalPrompt && (
          <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
            <input
              type="text"
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="Record today’s goals"
              className="input"
            />
            <button className="button" onClick={handleRecordGoals} disabled={!goalText.trim()}>
              <span className="bi bi-journal-check"></span> Save
            </button>
            <button className="button" onClick={() => setShowGoalPrompt(false)}>
              <span className="bi bi-x"></span> Later
            </button>
          </div>
        )}
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
        <details style={{ marginLeft: 'auto' }}>
          <summary className="button">API</summary>
          <div style={{ padding: '0.5rem' }}>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="OpenAI API Key (optional)"
              className="input"
              style={{ width: '16rem' }}
            />
          </div>
        </details>
      </div>
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      <section className="listSection">
        <TaskList
          tasks={tasks}
          onPriorityChange={handlePriorityChange}
          onArchiveChecked={handleArchiveChecked}
        />
        {loading && <div className="empty">Refining tasks with AI...</div>}
      </section>
      <details className="listSection" style={{ marginTop: '0.5rem' }}>
        <summary><strong>Labs & Feedback</strong></summary>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
          <textarea
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share ideas or test notes here..."
            className="input"
            style={{ width: '100%' }}
          />
          <button className="button" onClick={handleSaveFeedback}><span className="bi bi-save"></span> Save Feedback</button>
        </div>
      </details>
      {archive.length > 0 && (
        <section className="listSection" aria-label="Archive">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <strong>Archive</strong>
            <button className="button" onClick={handleClearArchive}><span className="bi bi-trash"></span> Clear</button>
          </div>
          <ul className="list scrollable-list">
            {archive.map((t, i) => (
              <li key={i} className="item">
                <span>{t.text || t.original}</span>
                {typeof t.priority === 'number' && <span className="priority-tag">P{t.priority}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
      <footer className="footer">
        &copy; {new Date().getFullYear()} STARKSERVICES
      </footer>
    </div>
  );
}