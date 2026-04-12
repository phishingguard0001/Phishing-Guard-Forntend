import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Login/Login.css";
import Logo from "../../assets/phishing_logo.png";
import { API_BASE } from "../../config/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/forgot-password`, { email });
      setMessage(res.data.message || "OTP sent to your email");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/reset-password`, { email, otp, newPassword });
      setMessage(res.data.message || "Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-glow" />
        <div className="auth-left-content">
          <div className="auth-brand" onClick={() => navigate("/")}>
            <img src={Logo} alt="PhishGuard" className="auth-logo" />
            <span className="auth-brand-name">PhishGuard</span>
          </div>
          <h2 className="auth-left-title">
            Recover your<br />
            <span className="auth-left-accent">account access</span>
          </h2>
          <p className="auth-left-sub">
            We'll help you securely reset your password using an email verification code.
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-card-icon">🔑</div>
            <h1 className="auth-card-title">Reset Password</h1>
            <p className="auth-card-sub">
              {step === 1 ? "Enter your email to receive an OTP" : "Enter the OTP and your new password"}
            </p>
          </div>

          {error && <div className="auth-error">{error}</div>}
          {message && <div style={{color: "#10b981", background: "rgba(16, 185, 129, 0.1)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(16, 185, 129, 0.2)", marginBottom: "20px", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "8px"}}>✅ {message}</div>}

          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="auth-form">
              <div className="auth-field">
                <label className="auth-label">Email Address</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">✉</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? "Sending..." : "Send OTP →"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="auth-form">
              <div className="auth-field">
                <label className="auth-label">Enter 6-digit OTP</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔢</span>
                  <input
                    type="text"
                    name="otp"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="auth-input"
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">New Password</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔑</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="auth-input"
                    required
                  />
                </div>
              </div>

              <div className="auth-field" style={{ position: "relative" }}>
                <label className="auth-label">Confirm New Password</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔑</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? "Resetting..." : "Reset Password →"}
              </button>
            </form>
          )}

          <div className="auth-divider"><span>or</span></div>

          <p className="auth-switch">
            Remembered your password?{" "}
            <span onClick={() => navigate("/login")}>Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
}
