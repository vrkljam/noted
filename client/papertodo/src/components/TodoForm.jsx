import { useState } from "react";

function TodoForm({ addTodo }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    addTodo(text);

    setText("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="form-control task-input"
        placeholder="Write a task..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </form>
  );
}

export default TodoForm;
