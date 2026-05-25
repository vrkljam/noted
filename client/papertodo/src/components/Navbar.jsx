import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar({ darkMode, setDarkMode }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg px-4 py-2">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* LEFT: Branding Brand */}
        <span className="navbar-brand logo-text m-0">Noted! 📝</span>

        {/* CENTER: Dynamic Greeting */}
        <div className="navbar-greeting">
          {user ? (
            <span className="welcome-user">Welcome, {user.username}! ✨</span>
          ) : (
            <span className="welcome-guest">Welcome, Guest! ✒️</span>
          )}
        </div>

        {/* RIGHT: Conditional Actions & Theme Toggle */}
        <div className="d-flex align-items-center gap-3">
          {user ? (
            /* Show when LOGGED IN */
            <button className="btn-nav" onClick={logout}>
              Log Out
            </button>
          ) : (
            /* Show when LOGGED OUT */
            <span className="auth-status-badge">Please Sign In</span>
          )}

          {/* Theme Switcher */}
          <button
            className="nav-theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
