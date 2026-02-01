import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Auth() {
  const [type, setType] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert("Email and password are required");
      return;
    }

    try {
      const res = await fetch(
        "https://phishing-guard-6m3y.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ Store auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: form.email,
          role: data.role,
        })
      );

      // ✅ ROLE-BASED REDIRECT (HashRouter safe)
      if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert("Server error. Please try again.");
    }
  };

  /* ================= REGISTER ================= */
  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await fetch(
        "https://phishing-guard-6m3y.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registration successful. Please login.");
      setType("login");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{type === "login" ? "Log In Now" : "Register Now"}</h2>

        {type === "register" && (
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Your Password"
          value={form.password}
          onChange={handleChange}
        />

        <button
          className="primary-btn"
          onClick={type === "login" ? handleLogin : handleRegister}
        >
          {type === "login" ? "Log In Now" : "Register Now"}
        </button>

        <button className="google-btn" disabled>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7hjxMaDl9C1-v2yVRVcwygeFwteVaXf4gug&s"
            alt="google"
          />
          {type === "login"
            ? "Log In With Google"
            : "Sign Up With Google"}
        </button>

        <p className="switch-text">
          {type === "login"
            ? "Didn't create an account?"
            : "Already have an account?"}
          <span
            onClick={() =>
              setType(type === "login" ? "register" : "login")
            }
          >
            {type === "login" ? " Register now" : " Login now"}
          </span>
        </p>
      </div>
    </div>
  );
}
