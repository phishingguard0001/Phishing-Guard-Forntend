import { useEffect, useState } from "react";
import "./Users.css";
import "../pages/admin-shared.css";
import { API_BASE } from "../../config/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ email: "", role: "", name: "" });
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/user/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Failed to fetch users"); return; }
      setUsers(data);
    } catch { alert("Server error"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      const res = await fetch(`${API_BASE}/api/user/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to delete user");
        return;
      }
      setUsers(users.filter(u => u._id !== id));
    } catch { alert("Server error while deleting"); }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditForm({
      email: user.email || "",
      role: user.role || "user",
      name: user.name || ""
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/api/user/${editingUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Update failed"); return; }
      
      setUsers(users.map(u => u._id === editingUser._id ? data.user : u));
      setEditingUser(null);
    } catch { alert("Server error while updating"); }
    finally { setUpdating(false); }
  };

  if (loading) return <div className="ap-loading"><div className="ap-spinner" /><p>Loading users…</p></div>;

  return (
    <div className="users-page">
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
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="6" className="no-data">No users found</td></tr>
            ) : (
              users.map((user, i) => {
                const initial = (user.name || user.email || "?")[0].toUpperCase();
                return (
                  <tr key={user._id}>
                    <td>{i + 1}</td>
                    <td>
                      <span className="users-avatar">{initial}</span>
                    </td>
                    <td>{user.name || "—"}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`ap-badge ap-badge--${user.role === "admin" ? "admin" : "user"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div className="users-actions">
                        <button className="u-btn u-btn--edit" onClick={() => openEditModal(user)}>Edit</button>
                        <button className="u-btn u-btn--delete" onClick={() => handleDelete(user._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit User Details</h2>
              <button className="modal-close" onClick={() => setEditingUser(null)}>&times;</button>
            </div>
            <form onSubmit={handleUpdate} className="modal-form">
              <div className="ap-field">
                <label className="ap-label">Full Name</label>
                <input
                  type="text"
                  className="ap-input"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="User's Name"
                />
              </div>
              <div className="ap-field">
                <label className="ap-label">Email Address</label>
                <input
                  type="email"
                  className="ap-input"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="ap-field">
                <label className="ap-label">Role</label>
                <select
                  className="ap-input"
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="ap-btn" onClick={() => setEditingUser(null)}>Cancel</button>
                <button type="submit" className="ap-btn ap-btn--primary" disabled={updating}>
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
