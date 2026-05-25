import TodoItem from "./TodoItem";

function TodoList({ todos, deleteTodo, toggleComplete, updateTodo }) {
  return (
    <div className="mt-4">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          deleteTodo={deleteTodo}
          toggleComplete={toggleComplete}
          updateTodo={updateTodo}
        />
      ))}
    </div>
  );
}

export default TodoList;
