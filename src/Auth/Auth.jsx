import { useState } from "react";
import "./Auth.css";

export default function Auth() {
  const [type, setType] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    const res = await fetch("https://phishing-guard-6m3y.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({ email: form.email, role: data.role }),
    );
    localStorage.setItem("token", data.token);

    window.location.href = "/";
  };

  /* ================= REGISTER ================= */
  const handleRegister = async () => {
    const res = await fetch("https://phishing-guard-6m3y.onrender.com/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message);
      return;
    }

    alert("Registration successful. Please login.");
    setType("login");
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
            onChange={handleChange}
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Your Password"
          onChange={handleChange}
        />

        <button
          className="primary-btn"
          onClick={type === "login" ? handleLogin : handleRegister}
        >
          {type === "login" ? "Log In Now" : "Register Now"}
        </button>

        <button className="google-btn">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7hjxMaDl9C1-v2yVRVcwygeFwteVaXf4gug&s"
            alt="google"
          />
          {type === "login" ? "Log In Now With Google" : "Sign Up With Google"}
        </button>

        <p className="switch-text">
          {type === "login"
            ? "Didn't create an account?"
            : "Already have an account?"}
          <span
            onClick={() => setType(type === "login" ? "register" : "login")}
          >
            {type === "login" ? " Register now" : " Login now"}
          </span>
        </p>
      </div>
    </div>
  );
}
