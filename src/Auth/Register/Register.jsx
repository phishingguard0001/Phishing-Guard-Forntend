import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [strength, setStrength] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { name, email, password, confirmPassword, role } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "password") {
      calculateStrength(e.target.value);
    }
  };

  const calculateStrength = (pass) => {
    let score = 0;
    if (pass.length > 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    setStrength(score);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await axios.post(
        "https://phishing-guard-6m3y.onrender.com/api/auth/register",
        { name, email, password, role },
      );

      setMessage("Registration Successful!");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  const strengthLabel = ["Weak", "Fair", "Good", "Strong"][strength - 1] || "";

  return (
    <div className="register-wrapper">
      <div className="container-fluid">
        <div className="row min-vh-100 align-items-center">
          {/* LEFT SECTION */}
          <div className="col-lg-6 left-panel">
            <h1>
              Secure Your <br />
              <span>Workspace</span>
            </h1>
            <p>
              Protect your organization from malicious phishing attempts with
              AI-powered detection and real-time response.
            </p>

            <div className="feature">
              <i className="fa-solid fa-shield-halved"></i>
              <div>
                <h6>Advanced Threat Intelligence</h6>
                <p>Real-time scanning of all incoming communications.</p>
              </div>
            </div>

            <div className="feature">
              <i className="fa-solid fa-lock"></i>
              <div>
                <h6>Zero-Trust Architecture</h6>
                <p>Secure-by-design principles for your enterprise.</p>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="col-lg-6 d-flex justify-content-center">
            <div className="register-card">
              <h4>Create Account</h4>
              <p className="subtext">Enter your details to join the defense</p>

              {error && <div className="alert alert-danger">{error}</div>}
              {message && <div className="alert alert-success">{message}</div>}

              <form onSubmit={handleSubmit}>
                <label>Full Name</label>
                <div className="input-box">
                  <i className="fa-solid fa-user"></i>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <label>Email</label>
                <div className="input-box">
                  <i className="fa-solid fa-envelope"></i>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <label>Password</label>
                    <div className="input-box">
                      <i className="fa-solid fa-lock"></i>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={password}
                        onChange={handleChange}
                        required
                      />
                      <span
                        className="eye"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i
                          className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                        ></i>
                      </span>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label>Confirm</label>
                    <div className="input-box">
                      <i className="fa-solid fa-lock"></i>
                      <input
                        type={showConfirm ? "text" : "password"}
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <span
                        className="eye"
                        onClick={() => setShowConfirm(!showConfirm)}
                      >
                        <i
                          className={`fa-solid ${showConfirm ? "fa-eye-slash" : "fa-eye"}`}
                        ></i>
                      </span>
                    </div>
                  </div>
                  {password && (
                    <>
                      <div className="strength-bar">
                        <div
                          className={`strength-fill strength-${strength}`}
                        ></div>
                      </div>
                      <small className="strength-text">
                        Security Strength: {strengthLabel}
                      </small>
                    </>
                  )}
                </div>

                {/* PASSWORD STRENGTH */}

                {/* ROLE */}
                <label>Role</label>
                <select
                  className="form-select role-select"
                  name="role"
                  value={role}
                  onChange={handleChange}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>

                <button type="submit" className="btn-register">
                  Sign Up & Secure{" "}
                  <i className="fa-solid fa-arrow-right ms-2"></i>
                </button>
              </form>

              <div className="encryption-text">
                <i className="fa-solid fa-shield"></i> AES-256 Bit Encrypted
                Registration
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
