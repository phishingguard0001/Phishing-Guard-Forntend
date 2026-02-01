import { useState } from "react";
import "./Alerts.css";

export default function Alerts() {
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendAlert = async () => {
    if (!message.trim()) {
      alert("Message is required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://phishing-guard-6m3y.onrender.com/api/admin/alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: userId || null,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to send alert");
        return;
      }

      alert("Alert sent successfully");
      setUserId("");
      setMessage("");
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="alerts-container">
      <h2>Send Alert</h2>

      <label className="alert-label">User ID (optional)</label>
      <input
        type="text"
        placeholder="Leave blank to broadcast to all users"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="alert-input"
      />
      <p className="alert-hint">
        Leave empty to send this alert to all users
      </p>

      <label className="alert-label">Alert Message</label>
      <textarea
        placeholder="Enter alert message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="alert-textarea"
      />

      <button
        onClick={sendAlert}
        disabled={loading}
        className="alert-button"
      >
        {loading ? "Sending..." : "Send Alert"}
      </button>
    </div>
  );
}
