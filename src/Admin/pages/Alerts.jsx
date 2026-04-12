import { useState } from "react";
import "./Alerts.css";
import "../pages/admin-shared.css";
import { API_BASE } from "../../config/api";

export default function Alerts() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const sendAlert = async () => {
    if (!email.trim() || !message.trim()) {
      alert("Email and message are required");
      return;
    }
    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch(`${API_BASE}/api/admin/alert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email, message }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Failed to send alert"); return; }
      setSuccess(true);
      setEmail("");
      setMessage("");
    } catch { alert("Server error"); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div className="ap-header">
        <h1>Send Alert</h1>
        <p>Send a security alert notification directly to a user's email</p>
      </div>

      <div className="alerts-card">
        {success && (
          <div className="ap-toast">
            ✅ Alert sent successfully!
          </div>
        )}

        <div className="alerts-field">
          <label className="ap-label">Recipient Email</label>
          <input
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="ap-input"
          />
        </div>

        <div className="alerts-field">
          <label className="ap-label">Alert Message</label>
          <textarea
            placeholder="Describe the security threat or reason for this alert…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="ap-textarea"
            rows={6}
          />
        </div>

        <button
          className="ap-btn ap-btn--primary"
          onClick={sendAlert}
          disabled={loading}
        >
          {loading ? "Sending…" : "🔔 Send Alert"}
        </button>
      </div>
    </div>
  );
}
