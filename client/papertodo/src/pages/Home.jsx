import { useEffect, useState, useContext } from "react"; // <-- Add useContext
import { AuthContext } from "../context/AuthContext"; // <-- Import your AuthContext

import API from "../services/api";
import Navbar from "../components/Navbar";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import AuthForm from "../components/AuthForm";
import AdminDashboard from "../pages/AdminDashboard";

function Home() {
  const [todos, setTodos] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // 2. STATE TO TOGGLE BETWEEN TODO VIEW AND ADMIN VIEW
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Grab the global user state from your new AuthContext
  const { user } = useContext(AuthContext);

  // LOAD TODOS
  const fetchTodos = async () => {
    try {
      const response = await API.get("/todos");

      setTodos(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // CREATE TODO
  const addTodo = async (text) => {
    try {
      const response = await API.post("/todos", {
        text,
      });

      setTodos([response.data, ...todos]);
    } catch (error) {
      console.log(error);
    }
  };

  //   UPDATE TODO
  const updateTodo = async (updatedTodo) => {
    try {
      const response = await API.put(`/todos/${updatedTodo._id}`, {
        text: updatedTodo.text,
        completed: updatedTodo.completed,
      });

      setTodos((prev) =>
        prev.map((t) => (t._id === updatedTodo._id ? response.data : t)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  // DELETE TODO
  const deleteTodo = async (id) => {
    try {
      await API.delete(`/todos/${id}`);

      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  // TOGGLE COMPLETE
  const toggleComplete = async (todo) => {
    try {
      const response = await API.put(`/todos/${todo._id}`, {
        text: todo.text,
        completed: !todo.completed,
      });

      setTodos(todos.map((t) => (t._id === todo._id ? response.data : t)));
    } catch (error) {
      console.log(error);
    }
  };

  // Only fetch todos if a logged-in user exists
  useEffect(() => {
    if (user) {
      fetchTodos();
    } else {
      setTodos([]); // Clear out the list if they log out
      setShowAdminPanel(false); // Reset to standard view on logout
    }
  }, [user]); // Re-run this effect whenever the user logging in/out state changes

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="app-background">
        <div className="container py-5">
          <div className="paper">
            {/* 3. SHOW ADMIN TOGGLE BUTTON ONLY IF LOGGED-IN USER IS AN ADMIN */}
            {user &&
              (() => {
                const token = localStorage.getItem("token");
                if (!token) return false;
                try {
                  const payload = JSON.parse(atob(token.split(".")[1]));
                  return payload.role === "admin";
                } catch (e) {
                  return false;
                }
              })() && (
                <div style={{ textAlign: "right", marginBottom: "20px" }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowAdminPanel(!showAdminPanel)}
                  >
                    {showAdminPanel
                      ? "← Back to My Tasks"
                      : "🔧 Open Admin Panel"}
                  </button>
                </div>
              )}

            <h1 className="title mb-5">
              {showAdminPanel ? "Admin Controls" : "My Tasks"}
            </h1>

            {user ? (
              // 4. CONDITIONALLY RENDER THE PANEL OR THE TODO LIST
              showAdminPanel ? (
                <AdminDashboard />
              ) : (
                <>
                  <TodoForm addTodo={addTodo} />

                  <TodoList
                    todos={todos}
                    deleteTodo={deleteTodo}
                    toggleComplete={toggleComplete}
                    updateTodo={updateTodo}
                  />
                </>
              )
            ) : (
              /* If logged out, display a friendly prompt on the paper */
              <div className="text-center py-5">
                <p
                  className="task-input text-muted"
                  style={{ fontFamily: "Caveat, cursive", fontSize: "2.5rem" }}
                >
                  Please sign in to view your notebook pages. ✒️
                </p>
                <AuthForm />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
