import { useState } from "react";

function TodoItem({ todo, deleteTodo, toggleComplete, updateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const [rotationStyle] = useState(() => ({
    transform: `rotate(${Math.random() * 2 - 1}deg)`,
    color: Math.random() > 0.5 ? "var(--ink)" : "var(--ink-secondary)",
  }));

  const handleSave = () => {
    if (!editText.trim()) return;

    updateTodo({
      ...todo,
      text: editText,
    });

    setIsEditing(false);
  };

  return (
    <div className="todo-item d-flex justify-content-between align-items-center">
      {isEditing ? (
        <input
          className="task-input"
          style={rotationStyle}
          value={editText}
          autoFocus
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setEditText(todo.text);
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <div className="todo-content d-flex align-items-center flex-grow-1">
          <input
            type="checkbox"
            className="task-check"
            checked={todo.completed}
            onClick={(e) => e.stopPropagation()} // Captures the click event early
            onChange={() => toggleComplete(todo)} // Handles the functional state change
          />
          <span
            className={`todo-text ${todo.completed ? "completed" : ""}`}
            style={rotationStyle}
            onClick={() => setIsEditing(true)}
          >
            {todo.text}
          </span>
        </div>
      )}

      <button
        className="btn btn-sm btn-danger"
        onClick={() => deleteTodo(todo._id)}
      >
        X
      </button>
    </div>
  );
}

export default TodoItem;
