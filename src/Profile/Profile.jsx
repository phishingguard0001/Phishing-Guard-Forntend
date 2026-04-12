import { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";
import { API_BASE } from "../config/api";

export default function Profile() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    profileImage: "",
    email: "",
    name: "", // fallback
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({
        firstName: res.data.firstName || "",
        lastName: res.data.lastName || "",
        age: res.data.age || "",
        gender: res.data.gender || "",
        profileImage: res.data.profileImage || "",
        email: res.data.email || "",
        name: res.data.name || "",
      });
      if (res.data.profileImage) {
        setImagePreview(`${API_BASE}${res.data.profileImage}`);
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("firstName", user.firstName);
    formData.append("lastName", user.lastName);
    formData.append("age", user.age);
    formData.append("gender", user.gender);
    if (imageFile) {
      formData.append("profileImage", imageFile);
    }

    try {
      const res = await axios.put(`${API_BASE}/api/user/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage({ type: "success", text: "Profile updated successfully!" });
      
      // Update local storage user config just in case
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="prof-loading"><div className="prof-spinner" /> Loading Profile...</div>;
  }

  return (
    <div className="prof-page">
      <div className="prof-glow prof-glow-1" />
      <div className="prof-wrapper">
        <div className="prof-header">
          <h1 className="prof-title">My Profile</h1>
          <p className="prof-subtitle">Manage your personal information and settings.</p>
        </div>

        {message.text && (
          <div className={`prof-alert prof-alert-${message.type}`}>
            {message.type === "success" ? "✅ " : "⚠️ "} {message.text}
          </div>
        )}

        <div className="prof-card">
          <form onSubmit={handleSave}>
            <div className="prof-top-section">
              <div className="prof-avatar-section">
                <div className="prof-avatar-wrap">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="prof-avatar-img" />
                  ) : (
                    <div className="prof-avatar-placeholder">
                      {user.firstName ? user.firstName[0] : user.name ? user.name[0] : "👤"}
                    </div>
                  )}
                  <label htmlFor="prof-upload" className="prof-avatar-edit">✏️</label>
                  <input
                    type="file"
                    id="prof-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
                <div className="prof-email">{user.email}</div>
              </div>
            </div>

            <div className="prof-grid">
              <div className="prof-field">
                <label>First Name</label>
                <input
                  type="text"
                  value={user.firstName}
                  onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                  placeholder="Enter first name"
                />
              </div>

              <div className="prof-field">
                <label>Last Name</label>
                <input
                  type="text"
                  value={user.lastName}
                  onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                  placeholder="Enter last name"
                />
              </div>

              <div className="prof-field">
                <label>Age</label>
                <input
                  type="number"
                  value={user.age}
                  onChange={(e) => setUser({ ...user, age: e.target.value })}
                  placeholder="e.g. 25"
                />
              </div>

              <div className="prof-field">
                <label>Gender</label>
                <select
                  value={user.gender}
                  onChange={(e) => setUser({ ...user, gender: e.target.value })}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer Not to Say">Prefer Not to Say</option>
                </select>
              </div>
            </div>

            <div className="prof-actions">
              <button type="submit" className="prof-btn-save" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
