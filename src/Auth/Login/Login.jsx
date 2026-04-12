import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Logo from "../../assets/phishing_logo.png";
import { API_BASE } from "../../config/api";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to detection
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/detection");
    }
  }, [navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, formData);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      // Navigate to /detection on successful login
      navigate("/detection");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-left-glow" />
        <div className="auth-left-content">
          <div className="auth-brand" onClick={() => navigate("/")}>
            <img src={Logo} alt="PhishGuard" className="auth-logo" />
            <span className="auth-brand-name">PhishGuard</span>
          </div>
          <h2 className="auth-left-title">
            Protect against<br />
            <span className="auth-left-accent">phishing threats</span>
          </h2>
          <p className="auth-left-sub">
            Advanced AI protection that stops malicious links and phishing attempts before they reach your team.
          </p>
          <div className="auth-features">
            {[
              { icon: "fa-solid fa-shield-halved", text: "Real-time threat detection" },
              { icon: "fa-solid fa-bolt", text: "Instant AI risk scoring" },
              { icon: "fa-solid fa-lock", text: "AES-256 encrypted data" },
              { icon: "fa-solid fa-chart-line", text: "Full threat analytics dashboard" },
            ].map((f) => (
              <div className="auth-feature-item" key={f.text}>
                <div className="auth-feature-icon">
                  <i className={f.icon}></i>
                </div>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-card-icon" style={{ color: "var(--primary)" }}>
              <i className="fa-solid fa-user-shield"></i>
            </div>
            <h1 className="auth-card-title">Welcome back</h1>
            <p className="auth-card-sub">Access your security dashboard</p>
          </div>

          {error && <div className="auth-error">
            <i className="fa-solid fa-triangle-exclamation mr-2"></i> {error}
          </div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrap">
                <i className="fa-solid fa-envelope auth-input-icon"></i>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-label-row">
                <label className="auth-label">Password</label>
                <span className="auth-forgot" onClick={() => navigate("/forgot-password")}>Forgot?</span>
              </div>
              <div className="auth-input-wrap">
                <i className="fa-solid fa-key auth-input-icon"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="auth-input"
                  required
                />
                <button
                  type="button"
                  className="auth-eye"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                <>Sign In <i className="fa-solid fa-arrow-right"></i></>
              )}
            </button>
          </form>

          <div className="auth-divider"><span>or securely</span></div>

          <p className="auth-switch">
            New to PhishGuard?{" "}
            <span onClick={() => navigate("/register")}>Create Account</span>
          </p>

          <div className="auth-trust">
            <div className="auth-trust-item">
              <i className="fa-solid fa-certificate"></i> SOC2
            </div>
            <div className="auth-trust-item">
              <i className="fa-solid fa-lock"></i> AES-256
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
