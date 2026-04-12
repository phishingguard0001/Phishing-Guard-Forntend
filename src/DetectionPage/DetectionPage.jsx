import "./DetectionPage.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";

export default function DetectionPage() {
  const [scanType, setScanType] = useState("URL");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handlePaste = (e) => {
    if (scanType === "URL") {
      const pastedText = (e.clipboardData || window.clipboardData).getData("text");
      const trimmed = pastedText.trim();
      
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
      const hasSpacesOrNewlines = /\s/.test(trimmed);
      
      if (isEmail) {
        e.preventDefault();
        alert("You pasted an email address. Please select 'Email Scan' to check emails.");
        return;
      }
      
      if (hasSpacesOrNewlines) {
        e.preventDefault();
        alert("Please paste a single valid URL without spaces or newlines.");
        return;
      }
      
      if (!trimmed.includes('.')) {
        e.preventDefault();
        alert("The pasted text does not look like a valid URL.");
        return;
      }
    }
  };

  const handleChange = (e) => {
    let val = e.target.value;
    if (scanType === "URL") {
      // Remove any spaces or newlines typed
      val = val.replace(/\s+/g, '');
    }
    setInput(val);
  };

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setProgress(0);

    let fake = 0;
    const interval = setInterval(() => {
      if (fake < 50) fake += 5;
      else if (fake < 85) fake += 2;
      else if (fake < 95) fake += 0.5;
      
      setProgress(Math.floor(fake));
    }, 100);

    try {
      const res = await axios.post(
        `${API_BASE}/api/detection/analyze`,
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
    } catch (err) {
      clearInterval(interval);
      setLoading(false);
      
      if (err.response && err.response.status === 401) {
        alert("Session expired or invalid token. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      
      alert(err.response?.data?.message || "Detection failed. Please try again.");
    }
  };

  const levelColor = (level) => {
    if (level === "HIGH") return "dp-high";
    if (level === "MEDIUM") return "dp-medium";
    return "dp-safe";
  };

  const levelIcon = (level) => {
    if (level === "HIGH") return <i className="fa-solid fa-triangle-exclamation"></i>;
    if (level === "MEDIUM") return <i className="fa-solid fa-bolt"></i>;
    return <i className="fa-solid fa-check"></i>;
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
                {/* <div className="dp-card-dot" style={{ background: "#ef4444" }} />
                <div className="dp-card-dot" style={{ background: "#f59e0b" }} />
                <div className="dp-card-dot" style={{ background: "#22c55e" }} /> */}
                <span className="dp-card-label">Paste Content to Scan</span>
              </div>

              <div className="dp-scan-toggle">
                <button 
                  className={`dp-toggle-btn ${scanType === "URL" ? "active" : ""}`} 
                  onClick={() => { setScanType("URL"); setInput(""); }}
                >
                  URL Scan
                </button>
                <button 
                  className={`dp-toggle-btn ${scanType === "Email" ? "active" : ""}`} 
                  onClick={() => { setScanType("Email"); setInput(""); }}
                >
                  Email Scan
                </button>
              </div>

              <textarea
                className="dp-textarea"
                placeholder={scanType === "URL" ? "Enter suspicious URL here...\n\nExample:\n  https://secure-bank-verify.example/login" : "Paste full suspicious email body here..."}
                rows={scanType === "URL" ? 3 : 7}
                value={input}
                onPaste={handlePaste}
                onChange={handleChange}
              />

              <button
                className="dp-btn-scan"
                onClick={() => {
                  if (!input.trim()) {
                    alert("Please insert a URL or Email to scan first.");
                    return;
                  }
                  if (scanType === "URL") {
                    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim());
                    if (isEmail) {
                      alert("This looks like an email address. Please select 'Email Scan'.");
                      return;
                    }
                    if (!input.includes('.')) {
                      alert("Please enter a valid URL.");
                      return;
                    }
                  }
                  handleAnalyze();
                }}
              >
                <span className="dp-btn-icon"><i className="fa-solid fa-shield-halved"></i></span>
                Analyze for Threats
              </button>
            </div>
          </>
        )}

        {/* ── LOADING SCREEN ── */}
        {loading && (() => {
          const color = progress <= 40 ? "#22c55e" : progress <= 80 ? "#f59e0b" : "#ef4444";
          return (
            <div className="dp-loading">
              <div className="dp-speedometer-container">
                <svg viewBox="0 0 120 70" className="dp-speedometer-svg">
                  <path 
                    d="M 10 60 A 50 50 0 0 1 110 60" 
                    fill="none" 
                    stroke="#1e293b" 
                    strokeWidth="10" 
                    strokeLinecap="round" 
                  />
                  <path 
                    d="M 10 60 A 50 50 0 0 1 110 60" 
                    fill="none" 
                    stroke={color} 
                    strokeWidth="10" 
                    strokeLinecap="round" 
                    strokeDasharray={157.08} 
                    strokeDashoffset={157.08 * (1 - progress / 100)} 
                    style={{ transition: "stroke-dashoffset 0.1s linear, stroke 0.3s" }} 
                  />
                </svg>
                <div className="dp-speedometer-text" style={{ color }}>{progress}%</div>
              </div>
              <h3 className="dp-loading-title">Analyzing content…</h3>
              <p className="dp-loading-sub">Our AI model is scanning for threats</p>
            </div>
          );
        })()}

        {/* ── RESULT SCREEN ── */}
        {result && !loading && (
          <div className="dp-result">

            {/* Result hero */}
            <div className="dp-result-hero">
              <div className={`dp-result-icon ${levelColor(result.threatLevel)}`}>
                {levelIcon(result.threatLevel)}
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
              {/* Risk Score Meter */}
              <div className="dp-metric-card" key="Risk Score">
                <div style={{ position: "relative", width: "130px", height: "75px", display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                  <svg viewBox="0 0 120 70" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                    <path 
                      d="M 10 60 A 50 50 0 0 1 110 60" 
                      fill="none" 
                      stroke="#1e293b" 
                      strokeWidth="10" 
                      strokeLinecap="round" 
                    />
                    <path 
                      className="dp-animated-meter"
                      d="M 10 60 A 50 50 0 0 1 110 60" 
                      fill="none" 
                      stroke={
                        result.threatLevel === "HIGH" ? "#ef4444" : 
                        result.threatLevel === "MEDIUM" ? "#f59e0b" : "#22c55e"
                      } 
                      strokeWidth="10" 
                      strokeLinecap="round" 
                      strokeDasharray={157.08} 
                      style={{ 
                        "--target-offset": 157.08 * (1 - result.riskScore / 100)
                      }} 
                    />
                    <text x="24" y="58" fontSize="6" fill="#64748b" textAnchor="middle" fontWeight="600">0</text>
                    <text x="31" y="39" fontSize="6" fill="#64748b" textAnchor="middle" fontWeight="600">20</text>
                    <text x="47" y="26" fontSize="6" fill="#64748b" textAnchor="middle" fontWeight="600">40</text>
                    <text x="73" y="26" fontSize="6" fill="#64748b" textAnchor="middle" fontWeight="600">60</text>
                    <text x="89" y="39" fontSize="6" fill="#64748b" textAnchor="middle" fontWeight="600">80</text>
                    <text x="96" y="58" fontSize="6" fill="#64748b" textAnchor="middle" fontWeight="600">100</text>
                  </svg>
                  <div style={{ position: "absolute", bottom: "-5px", fontSize: "20px", fontWeight: "900", color: "#f1f5f9" }}>
                    {result.riskScore}<span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>/100</span>
                  </div>
                </div>
                <span className="dp-metric-label">Risk Score</span>
              </div>

              {[
                { icon: <i className="fa-solid fa-robot"></i>, label: "AI Confidence", value: `${result.confidence}%` },
                { icon: <i className="fa-solid fa-clock"></i>, label: "Scanned At", value: new Date().toLocaleTimeString() },
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
                <i className="fa-solid fa-flag"></i> Report this Threat
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
