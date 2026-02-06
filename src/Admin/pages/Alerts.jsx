import { useState } from "react";
import "./Alerts.css";

export default function Alerts() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendAlert = async () => {
    if (!email.trim()) {
      alert("Email is required");
      return;
    }

    if (!message.trim()) {
      alert("Message is required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://phishing-guard-6m3y.onrender.com/api/admin/alert",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            email,
            message,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to send alert");
        return;
      }

      alert("Alert sent successfully");
      setEmail("");
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

      <label className="alert-label">User Email</label>
      <input
        type="email"
        placeholder="Enter user email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="alert-input"
      />

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
