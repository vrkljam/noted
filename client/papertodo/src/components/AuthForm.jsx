import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function AuthForm() {
  const { login, register } = useContext(AuthContext);

  // State to track whether we are logging in or registering
  const [isLoginView, setIsLoginView] = useState(true);

  // Form input fields state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear old errors

    if (!username.trim() || !password.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      if (isLoginView) {
        await login(username, password);
      } else {
        await register(username, password);
      }
    } catch (err) {
      // Capture custom backend error message if available
      // setError(
      //   err.response?.data?.message ||
      //     "Something went wrong. Please try again.",
      // );
      setError(err.response?.data?.message || err.message || "Unknown Error");
    }
  };

  return (
    <div className="auth-container py-4">
      <div>
        {/* TEMPORARY DEBUG LINE */}
        <p style={{ color: "red", background: "yellow", padding: "10px" }}>
          Debug URL:{" "}
          {import.meta.env.VITE_BACKEND_URL || "Using Local Fallback"}
        </p>

        {/* The rest of your registration form... */}
      </div>
      <h2 className="auth-title mb-4">
        {isLoginView ? "Sign In" : "Create Account"}
      </h2>

      {error && (
        <div className="alert alert-danger py-2 px-3 mb-3 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
        <div className="form-group">
          <input
            type="text"
            className="task-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            className="task-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn-nav w-100 py-2 mt-2"
          style={{ fontSize: "1.3rem" }}
        >
          {isLoginView ? "Log In ✒️" : "Register ✨"}
        </button>
      </form>

      <div className="text-center mt-4">
        <button
          className="auth-toggle-btn"
          onClick={() => {
            setIsLoginView(!isLoginView);
            setError("");
          }}
        >
          {isLoginView
            ? "Don't have an account? Register here"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}

export default AuthForm;
