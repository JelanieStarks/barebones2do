import React, { useState, useEffect } from 'react';

/**
 * TaskList component displays a list of tasks with priorities and allows changing priorities.
 * @param {Object[]} tasks - Array of task objects: { text, original, priority, aiRefined }
 * @param {function} onPriorityChange - Function(idx, newPriority) to change a task's priority
 */
function TaskList({ tasks, onPriorityChange }) {
  const [checked, setChecked] = useState(Array(tasks.length).fill(false));

  // Update checked state if tasks change
  useEffect(() => {
    setChecked(Array(tasks.length).fill(false));
  }, [tasks]);

  if (!tasks || tasks.length === 0) {
    return <div className="empty">No tasks yet</div>;
  }

  const handleCheck = idx => {
    setChecked(prev => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    });
  };

  return (
    <ul className="list scrollable-list">
      {tasks.map((task, idx) => (
        <li key={idx} className="item">
          <button
            className={checked[idx] ? "check checked" : "check"}
            onClick={() => handleCheck(idx)}
            aria-label={checked[idx] ? "Uncheck task" : "Check task"}
          >
            {checked[idx] ? "✔" : "○"}
          </button>
          <span style={{ textDecoration: checked[idx] ? "line-through" : "none" }}>
            {task.text}
          </span>
          {typeof task.priority === 'number' && (
            <>
              <span className="priority-tag" title="Priority">P{task.priority}</span>
              <select
                value={task.priority}
                onChange={e => onPriorityChange && onPriorityChange(idx, Number(e.target.value))}
                className="priority-select"
                aria-label="Change priority"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default TaskList;