import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Logo from "../../assets/phishing_logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", formData);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate(user.role === "admin" ? "/admin/dashboard" : "/");
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
            AI-powered detection keeping you and your team safe from malicious links and emails.
          </p>
          <div className="auth-features">
            {[
              { icon: "🛡️", text: "Real-time threat detection" },
              { icon: "⚡", text: "Instant AI risk scoring" },
              { icon: "🔒", text: "AES-256 encrypted data" },
              { icon: "📊", text: "Full threat analytics dashboard" },
            ].map((f) => (
              <div className="auth-feature-item" key={f.text}>
                <span className="auth-feature-icon">{f.icon}</span>
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
            <div className="auth-card-icon">🔐</div>
            <h1 className="auth-card-title">Welcome back</h1>
            <p className="auth-card-sub">Sign in to your security dashboard</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">✉</span>
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
                <span className="auth-forgot">Forgot password?</span>
              </div>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔑</span>
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
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>

          <p className="auth-switch">
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")}>Create one free</span>
          </p>

          <div className="auth-trust">
            <span>🛡 AES-256</span>
            <span>✓ SOC2 Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
