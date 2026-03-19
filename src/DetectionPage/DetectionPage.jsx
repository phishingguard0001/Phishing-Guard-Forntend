import "./DetectionPage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DetectionPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/detection/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data.slice(0, 5));
    } catch (err) {
      console.error("History fetch error", err);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setProgress(0);

    let fake = 0;
    const interval = setInterval(() => {
      fake += 10;
      if (fake <= 90) setProgress(fake);
    }, 100);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/detection/analyze",
        { input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      clearInterval(interval);
      setProgress(100);
      setResult({
        threatLevel: res.data.threatLevel,
        riskScore: res.data.riskScore,
        confidence: res.data.confidence,
        details: res.data.details || [],
      });
      setLoading(false);
      await fetchHistory();
    } catch {
      clearInterval(interval);
      setLoading(false);
      alert("Detection failed. Please try again.");
    }
  };

  const levelColor = (level) => {
    if (level === "HIGH") return "dp-high";
    if (level === "MEDIUM") return "dp-medium";
    return "dp-safe";
  };

  const levelEmoji = (level) => {
    if (level === "HIGH") return "⚠";
    if (level === "MEDIUM") return "⚡";
    return "✓";
  };

  return (
    <div className="dp-page">
      <div className="dp-glow dp-glow-1" />
      <div className="dp-glow dp-glow-2" />

      <div className="dp-container">

        {/* ── INPUT SCREEN ── */}
        {!loading && !result && (
          <>
            {/* Hero */}
            <div className="dp-hero">
              <span className="dp-label">AI-POWERED THREAT SCANNER</span>
              <h1 className="dp-title">
                Phishing Threat{" "}
                <span className="dp-title-accent">Analysis</span>
              </h1>
              <p className="dp-subtitle">
                Paste any suspicious URL or email content below. Our AI model
                will analyze it in seconds and give you a detailed threat report.
              </p>
            </div>

            {/* Input card */}
            <div className="dp-card">
              <div className="dp-card-header">
                <div className="dp-card-dot" style={{ background: "#ef4444" }} />
                <div className="dp-card-dot" style={{ background: "#f59e0b" }} />
                <div className="dp-card-dot" style={{ background: "#22c55e" }} />
                <span className="dp-card-label">Paste Content to Scan</span>
              </div>

              <textarea
                className="dp-textarea"
                placeholder="Paste suspicious URL or email content here...&#10;&#10;Example:&#10;  https://secure-bank-verify.example/login&#10;  Or paste a full suspicious email body"
                rows={7}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />

              <button
                className="dp-btn-scan"
                onClick={handleAnalyze}
                disabled={!input.trim()}
              >
                <span className="dp-btn-icon">🛡</span>
                Analyze for Threats
              </button>
            </div>

            {/* Recent scans */}
            {history.length > 0 && (
              <div className="dp-history">
                <h6 className="dp-history-label">RECENT SCANS</h6>
                <div className="dp-history-list">
                  {history.map((item) => (
                    <div key={item._id} className="dp-history-item">
                      <div className={`dp-history-icon ${levelColor(item.threatLevel)}`}>
                        {levelEmoji(item.threatLevel)}
                      </div>
                      <div className="dp-history-content">
                        <span className="dp-history-text">
                          {item.input.length > 70
                            ? item.input.substring(0, 70) + "…"
                            : item.input}
                        </span>
                        <span className="dp-history-date">
                          {new Date(item.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <span className={`dp-history-badge ${levelColor(item.threatLevel)}`}>
                        {item.threatLevel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── LOADING SCREEN ── */}
        {loading && (
          <div className="dp-loading">
            <div className="dp-spinner" />
            <h3 className="dp-loading-title">Analyzing content…</h3>
            <p className="dp-loading-sub">Our AI model is scanning for threats</p>
            <div className="dp-progress-bar">
              <div className="dp-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="dp-progress-pct">{progress}%</span>
          </div>
        )}

        {/* ── RESULT SCREEN ── */}
        {result && !loading && (
          <div className="dp-result">

            {/* Result hero */}
            <div className="dp-result-hero">
              <div className={`dp-result-icon ${levelColor(result.threatLevel)}`}>
                {levelEmoji(result.threatLevel)}
              </div>
              <h2 className="dp-result-title">
                {result.threatLevel === "SAFE" ? "No Threat Detected" : "Phishing Threat Detected"}
              </h2>
              <div className={`dp-result-pill ${levelColor(result.threatLevel)}`}>
                ● THREAT LEVEL: {result.threatLevel}
              </div>
            </div>

            {/* Metrics row */}
            <div className="dp-metrics">
              {[
                { icon: "🎯", label: "Risk Score", value: `${result.riskScore}/100` },
                { icon: "🤖", label: "AI Confidence", value: `${result.confidence}%` },
                { icon: "🕒", label: "Scanned At", value: new Date().toLocaleTimeString() },
              ].map((m) => (
                <div className="dp-metric-card" key={m.label}>
                  <span className="dp-metric-icon">{m.icon}</span>
                  <span className="dp-metric-value">{m.value}</span>
                  <span className="dp-metric-label">{m.label}</span>
                </div>
              ))}
            </div>

            {/* Findings */}
            <div className="dp-findings">
              <h6 className="dp-findings-label">DETAILED FINDINGS</h6>
              {result.details.length > 0 ? (
                <div className="dp-findings-list">
                  {result.details.map((item, idx) => (
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

            {/* Actions */}
            <div className="dp-actions">
              <button
                className="dp-btn-primary"
                onClick={() => { setResult(null); setInput(""); }}
              >
                ← Scan Another
              </button>
              <button
                className="dp-btn-danger"
                onClick={() => navigate("/report")}
              >
                🚩 Report this Threat
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
