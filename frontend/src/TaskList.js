import React, { useState } from 'react';

function TaskList({ tasks }) {
  const [checked, setChecked] = useState(Array(tasks.length).fill(false));

  // Update checked state if tasks change
  React.useEffect(() => {
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
          <span style={{ textDecoration: checked[idx] ? "line-through" : "none" }}>{task}</span>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;