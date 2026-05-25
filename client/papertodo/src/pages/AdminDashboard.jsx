import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../services/api";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch all users on component load
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve your saved JWT

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await API.get("admin/users", config);
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch users. Are you an admin?",
        );
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle deleting a user
  const handleDelete = async (userId, username) => {
    if (
      !window.confirm(`Are you sure you want to delete user "${username}"?`)
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await API.delete(`/admin/users/${userId}`, config);

      // Update local state to remove the deleted user from the UI instantly
      setUsers(users.filter((user) => user._id !== userId));
      setSuccessMessage(`User "${username}" successfully deleted.`);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user.");
    }
  };

  if (loading)
    return <div style={{ padding: "20px" }}>Loading admin data...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Admin Dashboard: User Management</h2>

      {error && (
        <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>
      )}
      {successMessage && (
        <div style={{ color: "green", marginBottom: "15px" }}>
          {successMessage}
        </div>
      )}

      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
            <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>
              Username
            </th>
            <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>
              Role
            </th>
            <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>
              Created At
            </th>
            <th style={{ padding: "10px", borderBottom: "2px solid #ddd" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px" }}>{user.username}</td>
              <td style={{ padding: "10px" }}>
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: "4px",
                    backgroundColor: user.role === "admin" ? "#d4edda" : "#eee",
                    color: user.role === "admin" ? "#155724" : "#333",
                  }}
                >
                  {user.role}
                </span>
              </td>
              <td style={{ padding: "10px" }}>
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td style={{ padding: "10px" }}>
                <button
                  onClick={() => handleDelete(user._id, user.username)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
