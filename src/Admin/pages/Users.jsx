import { useEffect, useState } from "react";
import "./Users.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://phishing-guard-6m3y.onrender.com/api/user/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to fetch users");
        return;
      }

      setUsers(data);
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="users-page">
      <h2>Manage Users</h2>

      <table className="users-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>User ID</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" align="center">No users found</td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name || "-"}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`role-badge ${
                      user.role === "admin" ? "role-admin" : "role-user"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td>{user._id}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
