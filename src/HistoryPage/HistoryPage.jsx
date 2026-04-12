import "./HistoryPage.css";
import "../DetectionPage/DetectionPage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../config/api";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const token = localStorage.getItem("token");

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/detection/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (err) {
      console.error("History fetch error", err);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const levelColor = (level) => {
    if (level === "HIGH") return "hp-high";
    if (level === "MEDIUM") return "hp-medium";
    return "hp-safe";
  };

  const levelIcon = (level) => {
    if (level === "HIGH") return <i className="fa-solid fa-triangle-exclamation"></i>;
    if (level === "MEDIUM") return <i className="fa-solid fa-bolt"></i>;
    return <i className="fa-solid fa-check"></i>;
  };

  return (
    <div className="hp-page">
      <div className="hp-glow hp-glow-1" />
      <div className="hp-glow hp-glow-2" />

      <div className="hp-container">
        <div className="hp-hero">
          <span className="hp-label">YOUR PAST SCANS</span>
          <h1 className="hp-title">
            Detection <span className="hp-title-accent">History</span>
          </h1>
          <p className="hp-subtitle">
            Review your past phishing and threat analysis reports below.
          </p>
        </div>

        {selectedResult ? (
          <div className="dp-result">
            <div className="dp-result-hero">
              <div className={`dp-result-icon ${selectedResult.threatLevel === "HIGH" ? "dp-high" : selectedResult.threatLevel === "MEDIUM" ? "dp-medium" : "dp-safe"}`}>
                {levelIcon(selectedResult.threatLevel)}
              </div>
              <h2 className="dp-result-title">
                {selectedResult.threatLevel === "SAFE" ? "No Threat Detected" : "Phishing Threat Detected"}
              </h2>
              <div className={`dp-result-pill ${selectedResult.threatLevel === "HIGH" ? "dp-high" : selectedResult.threatLevel === "MEDIUM" ? "dp-medium" : "dp-safe"}`}>
                ● THREAT LEVEL: {selectedResult.threatLevel}
              </div>
            </div>

            <div className="dp-metrics">
              <div className="dp-metric-card" key="Risk Score">
                <div style={{ position: "relative", width: "130px", height: "75px", display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                  <svg viewBox="0 0 120 70" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                    <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
                    <path 
                      className="dp-animated-meter"
                      d="M 10 60 A 50 50 0 0 1 110 60" 
                      fill="none" 
                      stroke={ selectedResult.threatLevel === "HIGH" ? "#ef4444" : selectedResult.threatLevel === "MEDIUM" ? "#f59e0b" : "#22c55e" } 
                      strokeWidth="10" strokeLinecap="round" strokeDasharray={157.08} 
                      style={{ "--target-offset": 157.08 * (1 - selectedResult.riskScore / 100) }} 
                    />
                    <text x="24" y="58" fontSize="6" fill="#64748b" textAnchor="middle" fontWeight="600">0</text>
                    <text x="31" y="39" fontSize="6" fill="#64748b" textAnchor="middle" fontWeight="600">20</text>
                    <text x="47" y="26" fontSize="6" fill="#64748b" textAnchor="middle" fontWeight="600">40</text>
                    <text x="73" y="26" fontSize="6" fill="#64748b" textAnchor="middle" fontWeight="600">60</text>
                    <text x="89" y="39" fontSize="6" fill="#64748b" textAnchor="middle" fontWeight="600">80</text>
                    <text x="96" y="58" fontSize="6" fill="#64748b" textAnchor="middle" fontWeight="600">100</text>
                  </svg>
                  <div style={{ position: "absolute", bottom: "-5px", fontSize: "20px", fontWeight: "900", color: "#f1f5f9" }}>
                    {selectedResult.riskScore}<span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>/100</span>
                  </div>
                </div>
                <span className="dp-metric-label">Risk Score</span>
              </div>

              {[
                { icon: <i className="fa-solid fa-robot"></i>, label: "AI Confidence", value: `${selectedResult.confidence}%` },
                { icon: <i className="fa-solid fa-clock"></i>, label: "Scanned At", value: new Date(selectedResult.createdAt).toLocaleTimeString() },
              ].map((m) => (
                <div className="dp-metric-card" key={m.label}>
                  <span className="dp-metric-icon">{m.icon}</span>
                  <span className="dp-metric-value">{m.value}</span>
                  <span className="dp-metric-label">{m.label}</span>
                </div>
              ))}
            </div>

            <div className="dp-findings">
              <h6 className="dp-findings-label">DETAILED FINDINGS</h6>
              {selectedResult.details && selectedResult.details.length > 0 ? (
                <div className="dp-findings-list">
                  {selectedResult.details.map((item, idx) => (
                    <div key={idx} className="dp-finding-item">
                      <span className="dp-finding-dot" />
                      <span className="dp-finding-text">{item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="dp-findings-empty">No suspicious indicators detected.</p>
              )}
            </div>

            <div className="dp-actions">
              <button className="dp-btn-primary" onClick={() => setSelectedResult(null)}>
                ← Back to History
              </button>
            </div>
          </div>
        ) : history.length > 0 ? (
          <div className="hp-history-list">
            {history.map((item) => (
              <div 
                key={item._id} 
                className="hp-history-item" 
                onClick={() => setSelectedResult(item)}
                style={{ cursor: "pointer" }}
              >
                <div className={`hp-history-icon ${levelColor(item.threatLevel)}`}>
                  {levelIcon(item.threatLevel)}
                </div>
                <div className="hp-history-content">
                  <span className="hp-history-text">{item.input}</span>
                  <span className="hp-history-date">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
                <span className={`hp-history-badge ${levelColor(item.threatLevel)}`}>
                  {item.threatLevel}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="hp-empty">
            <i className="fa-solid fa-clock-rotate-left empty-icon"></i>
            <p>No scans found yet. Analyze a link or email to see it here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
