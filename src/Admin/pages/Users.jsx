import { useEffect, useState } from "react";
import "./Users.css";
import "../pages/admin-shared.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/user/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Failed to fetch users"); return; }
      setUsers(data);
    } catch { alert("Server error"); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="ap-loading"><div className="ap-spinner" /><p>Loading users…</p></div>;

  return (
    <div>
      <div className="ap-header">
        <h1>Manage Users</h1>
        <p>{users.length} registered user{users.length !== 1 ? "s" : ""} in the system</p>
      </div>

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Avatar</th>
              <th>Email</th>
              <th>Role</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="5" className="no-data">No users found</td></tr>
            ) : (
              users.map((user, i) => {
                const initial = (user.name || user.email || "?")[0].toUpperCase();
                return (
                  <tr key={user._id}>
                    <td>{i + 1}</td>
                    <td>
                      <span className="users-avatar">{initial}</span>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`ap-badge ap-badge--${user.role === "admin" ? "admin" : "user"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="users-id">{user._id}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
