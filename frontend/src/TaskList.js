import React from 'react';

/**
 * TaskList component displays a list of tasks with priorities, completion, and deletion.
 * @param {Object[]} tasks - Array of task objects: { id, text, original, priority, aiRefined, completed }
 * @param {function} onPriorityChange - Function(taskId, newPriority) to change a task's priority
 * @param {function} onComplete - Function(taskId) to complete a task
 * @param {function} onDelete - Function(taskId) to delete a task
 */
function TaskList({ tasks, onPriorityChange, onComplete, onDelete }) {
  if (!tasks || tasks.length === 0) {
    return <div className="empty">No tasks yet</div>;
  }

  return (
    <ul className="list scrollable-list">
      {tasks.map((task) => (
        <li key={task.id} className="item">
          <button
            className="check"
            onClick={() => onComplete && onComplete(task.id)}
            aria-label="Complete task"
            title="Complete task"
          >
            <span className="bi bi-circle"></span>
          </button>
          <span className="task-text">
            {task.text}
          </span>
          {typeof task.priority === 'number' && (
            <span className={`badge priority-${task.priority}`}>
              {task.priority === 1 ? 'Hot' : task.priority === 2 ? 'Warm' : 'Cold'}
            </span>
          )}
          {task.priority && (
            <select
              value={task.priority}
              onChange={e => onPriorityChange && onPriorityChange(task.id, Number(e.target.value))}
              className="priority-select"
              aria-label="Change priority"
            >
              <option value={1}>1 - Hot</option>
              <option value={2}>2 - Warm</option>
              <option value={3}>3 - Cold</option>
            </select>
          )}
          <button
            className="delete-btn"
            onClick={() => onDelete && onDelete(task.id)}
            aria-label="Delete task"
            title="Delete task"
          >
            <span className="bi bi-trash"></span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;