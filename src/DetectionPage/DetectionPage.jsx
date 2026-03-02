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

  // 🔥 Fetch recent scans
  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        "https://phishing-guard-6m3y.onrender.com/api/detection/history",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setHistory(res.data.slice(0, 5));
    } catch (err) {
      console.error("History fetch error", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResult(null);
    setProgress(0);

    let fakeProgress = 0;
    const interval = setInterval(() => {
      fakeProgress += 5;
      if (fakeProgress <= 90) setProgress(fakeProgress);
    }, 200);

    try {
      const res = await axios.post(
        "https://phishing-guard-6m3y.onrender.com/api/detection/analyze",
        { input },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const formattedResult = {
        threatLevel: res.data.threatLevel,
        riskScore: res.data.riskScore,
        confidence: res.data.confidence,
        details: res.data.details || [],
      };

      setTimeout(async () => {
        clearInterval(interval);
        setProgress(100);
        setResult(formattedResult);
        setLoading(false);

        await fetchHistory(); // 🔥 auto refresh recent scans
      }, 2000);
    } catch (err) {
      clearInterval(interval);
      setLoading(false);
      alert("Detection failed");
    }
  };

  return (
    <div className="detect-wrapper container py-5">
      {/* ================= INPUT SECTION ================= */}
      {!loading && !result && (
        <>
          <div className="detect-hero text-center mb-5">
            <h1>Phishing Threat Analysis</h1>
            <p>Securely scan suspicious URLs and emails in seconds.</p>
          </div>

          <div className="detect-card p-4">
            <textarea
              className="form-control detect-input"
              placeholder="Paste suspicious URL or email content here..."
              rows="6"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              className="btn btn-primary btn-lg w-100 mt-4"
              onClick={handleAnalyze}
            >
              <i className="fa-solid fa-shield-halved me-2"></i>
              Analyze for Threats
            </button>
          </div>

          {/* ===== Recent Scans ===== */}
          <div className="recent-section mt-5">
            <h6 className="recent-title">RECENT SCANS</h6>

            {history.length > 0 ? (
              history.map((item) => (
                <div key={item._id} className="recent-item">
                  <div
                    className={`status-icon ${
                      item.threatLevel === "HIGH" ? "danger" : "safe"
                    }`}
                  >
                    <i
                      className={`fa-solid ${
                        item.threatLevel === "HIGH" ? "fa-xmark" : "fa-check"
                      }`}
                    ></i>
                  </div>

                  <div className="recent-content">
                    <strong>
                      {item.input.length > 60
                        ? item.input.substring(0, 60) + "..."
                        : item.input}
                    </strong>
                    <div className="small text-muted">
                      {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div
                    className={`risk-badge ${
                      item.threatLevel === "HIGH" ? "badge-high" : "badge-safe"
                    }`}
                  >
                    {item.threatLevel}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted mt-3">No recent scans yet.</p>
            )}
          </div>
        </>
      )}

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="detect-card p-5 text-center">
          <div className="spinner-circle mb-4"></div>
          <h4>Analyzing...</h4>
          <div className="progress mt-4">
            <div className="progress-bar" style={{ width: `${progress}%` }}>
              {progress}%
            </div>
          </div>
        </div>
      )}

      {/* ================= RESULT ================= */}
      {result && !loading && (
        <div className="result-wrapper">
          {/* ================= TOP SECTION ================= */}
          <div className="result-top text-center">
            <div
              className={`alert-icon ${
                result.threatLevel === "HIGH"
                  ? "alert-high"
                  : result.threatLevel === "MEDIUM"
                    ? "alert-medium"
                    : "alert-safe"
              }`}
            >
              <i
                className={`fa-solid ${
                  result.threatLevel === "SAFE" ? "fa-check" : "fa-exclamation"
                }`}
              ></i>
            </div>

            <h2 className="result-title">
              {result.threatLevel === "SAFE"
                ? "No Threat Detected"
                : "Phishing Threat Detected"}
            </h2>

            <div
              className={`threat-pill ${
                result.threatLevel === "HIGH"
                  ? "pill-high"
                  : result.threatLevel === "MEDIUM"
                    ? "pill-medium"
                    : "pill-safe"
              }`}
            >
              ● THREAT LEVEL: {result.threatLevel}
            </div>
          </div>

          {/* ================= DETAILS CARD ================= */}
          <div className="result-details mt-5">
            <h6 className="detail-heading">DETAILED FINDINGS</h6>

            {result.details.length > 0 ? (
              result.details.map((item, index) => (
                <div key={index} className="detail-item">
                  <div className="detail-icon">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                  </div>
                  <div className="detail-text">{item}</div>
                </div>
              ))
            ) : (
              <p className="text-muted">No suspicious indicators detected.</p>
            )}
          </div>

          {/* ================= ACTIONS ================= */}
          <div className="result-actions mt-5 text-center">
            <button
              className="btn btn-primary px-5 me-3"
              onClick={() => {
                setResult(null);
                setInput("");
              }}
            >
              Scan Another
            </button>

            <button className="btn btn-outline-danger px-4" onClick={()=>navigate("/report")}>
              <i className="fa-solid fa-flag me-2"></i>
              Report this threat
            </button>
          </div>

          {/* ================= INFO CARDS ================= */}
          <div className="row mt-5">
            <div className="col-md-4">
              <div className="info-card">
                <i className="fa-solid fa-clock"></i>
                <h6>Detection Time</h6>
                <p>{new Date().toLocaleString()}</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="info-card">
                <i className="fa-solid fa-server"></i>
                <h6>Confidence Score</h6>
                <p>{result.confidence}% AI Match</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="info-card">
                <i className="fa-solid fa-shield-halved"></i>
                <h6>Risk Score</h6>
                <p>{result.riskScore}/100</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
