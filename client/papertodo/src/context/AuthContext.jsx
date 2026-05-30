import { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in when the app starts
  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
      setUser({ token, username });
      // Attach the token to all future API requests automatically
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  // LOGIN FUNCTION
  const login = async (username, password) => {
    const response = await API.post("/auth/login", { username, password });
    const { token, username: loggedInUser } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("username", loggedInUser);

    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser({ token, username: loggedInUser });
  };

  // REGISTER FUNCTION
  const register = async (username, password) => {
    const response = await API.post("/auth/register", {
      username,
      password,
    });
    const { token, username: registeredUser } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("username", registeredUser);

    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser({ token, username: registeredUser });
  };

  // LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    delete API.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
