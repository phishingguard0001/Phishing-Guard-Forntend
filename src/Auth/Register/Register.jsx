import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Login/Login.css";
import "./Register.css";
import Logo from "../../assets/phishing_logo.png";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "user" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [strength, setStrength] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { name, email, password, confirmPassword, role } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "password") calcStrength(e.target.value);
  };

  const calcStrength = (p) => {
    let s = 0;
    if (p.length > 6) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    setStrength(s);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    if (password !== confirmPassword) return setError("Passwords do not match");
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/auth/register", { name, email, password, role });
      setMessage("Account created! You can now sign in.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally { setLoading(false); }
  };

  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

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
            Secure your<br />
            <span className="auth-left-accent">workspace today</span>
          </h2>
          <p className="auth-left-sub">
            Join 5,000+ security professionals using AI-powered protection against phishing threats.
          </p>
          <div className="auth-features">
            {[
              { icon: "🛡️", text: "Advanced threat intelligence" },
              { icon: "🔒", text: "Zero-trust architecture" },
              { icon: "📧", text: "Email & URL scanning" },
              { icon: "📊", text: "Real-time risk analytics" },
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
            <div className="auth-card-icon">🚀</div>
            <h1 className="auth-card-title">Create account</h1>
            <p className="auth-card-sub">Start protecting your organization today</p>
          </div>

          {error   && <div className="auth-error">{error}</div>}
          {message && <div className="auth-success">✅ {message}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-label">Full Name</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">👤</span>
                <input type="text" name="name" placeholder="Jane Smith" value={name} onChange={handleChange} className="auth-input" required />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">✉</span>
                <input type="email" name="email" placeholder="name@company.com" value={email} onChange={handleChange} className="auth-input" required />
              </div>
            </div>

            <div className="auth-pw-grid">
              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔑</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password" placeholder="••••••••" value={password}
                    onChange={handleChange} className="auth-input" required
                  />
                  <button type="button" className="auth-eye" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Confirm</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔑</span>
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword" placeholder="••••••••" value={confirmPassword}
                    onChange={handleChange} className="auth-input" required
                  />
                  <button type="button" className="auth-eye" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? "🙈" : "👁"}
                  </button>
                </div>
              </div>
            </div>

            {password && (
              <div>
                <div className="auth-strength-bar">
                  <div className={`auth-strength-fill auth-strength-${strength}`} />
                </div>
                <div className="auth-strength-label">
                  Strength: {strengthLabels[strength - 1] || "—"}
                </div>
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label">Account Role</label>
              <select name="role" value={role} onChange={handleChange} className="auth-select">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>

          <div className="auth-divider"><span>or</span></div>

          <p className="auth-switch">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Sign in</span>
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
