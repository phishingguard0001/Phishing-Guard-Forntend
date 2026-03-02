import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("https://phishing-guard-6m3y.onrender.com/api/auth/login", {
        email,
        password,
      });

      console.log(res.data);

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.log(err.response);
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="icon-circle">
          <i className="fa-solid fa-fingerprint"></i>
        </div>

        <h2>Sign in to PhishGuard</h2>
        <p className="subtext">
          Enter your credentials to access your security dashboard.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Email Address</label>
          <div className="input-box">
            <i className="fa-solid fa-envelope"></i>
            <input
              type="email"
              name="email"
              placeholder="name@company.com"
              value={email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="password-row">
            <label>Password</label>
            <span className="forgot">Forgot Password?</span>
          </div>

          <div className="input-box">
            <i className="fa-solid fa-lock"></i>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
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

          <button type="submit" className="btn-login">
            Sign In <i className="fa-solid fa-arrow-right ms-2"></i>
          </button>
        </form>

        <hr />

        <p className="create">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Create Account</span>
        </p>

        <div className="security">
          <span>
            <i className="fa-solid fa-shield-halved"></i> AES-256 ENCRYPTED
          </span>
          <span>
            <i className="fa-solid fa-check"></i> SOC2 COMPLIANT
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
