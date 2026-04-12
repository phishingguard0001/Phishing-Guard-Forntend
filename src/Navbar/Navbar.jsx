import "./Navbar.css";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "./../assets/phishing_logo.png";
import { API_BASE } from "../config/api";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Load user from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        const parsed = JSON.parse(storedUser);
        if (parsed?.email) {
          setUser({ ...parsed, username: parsed.email.split("@")[0] });
        } else setUser(null);
      } else setUser(null);
    } catch {
      localStorage.removeItem("user");
      setUser(null);
    }
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".ng-dropdown")) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    setIsOpen(false);
    setOpenDropdown(false);
  };

  const close = () => {
    setIsOpen(false);
    setOpenDropdown(false);
  };

  return (
    <nav className={`ng-navbar ${scrolled ? "ng-scrolled" : ""}`}>
      <div className="ng-inner">
        {/* Logo */}
        <NavLink className="ng-brand" to="/" onClick={close}>
          <img src={Logo} alt="PhishGuard" className="ng-logo" />
        </NavLink>

        {/* Desktop Links */}
        <ul className="ng-links">
          {/* <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `ng-link ${isActive ? "ng-active" : ""}`
              }
              end
              onClick={close}
            >
              Home
            </NavLink>
          </li> */}
          <li>
            <NavLink
              to="/detection"
              className={({ isActive }) =>
                `ng-link ${isActive ? "ng-active" : ""}`
              }
              onClick={close}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `ng-link ${isActive ? "ng-active" : ""}`
              }
              onClick={close}
            >
              History
            </NavLink>
          </li>

          {/* <li>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                `ng-link ${isActive ? "ng-active" : ""}`
              }
              onClick={close}
            >
              Pricing
            </NavLink>
          </li> */}
        </ul>

        {/* Auth */}
        <div className="ng-auth">
          {!user ? (
            <>
              <NavLink to="/login" className="ng-btn-ghost" onClick={close}>
                Log in
              </NavLink>
              <NavLink
                to="/register"
                className="ng-btn-primary"
                onClick={close}
              >
                Get Started
              </NavLink>
            </>
          ) : (
            <div className="ng-dropdown">
              <button
                className="ng-avatar-btn"
                onClick={() => setOpenDropdown((prev) => !prev)}
              >
                {user.profileImage ? (
                  <img
                    src={`${API_BASE}${user.profileImage}`}
                    alt="Avatar"
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #334155",
                    }}
                  />
                ) : (
                  <span className="ng-avatar-circle">
                    {user.firstName
                      ? user.firstName[0].toUpperCase()
                      : user.username?.[0]?.toUpperCase()}
                  </span>
                )}
                <span className="ng-username">{user.username}</span>
                <span className="ng-chevron">▾</span>
              </button>

              {openDropdown && (
                <div className="ng-dropdown-menu">
                  {user.role === "admin" && (
                    <NavLink
                      className="ng-dropdown-item"
                      to="/admin/dashboard"
                      onClick={close}
                    >
                      Admin Dashboard
                    </NavLink>
                  )}

                  <NavLink
                    className="ng-dropdown-item"
                    to="/profile"
                    onClick={close}
                  >
                    My Profile
                  </NavLink>

                  <NavLink
                    className="ng-dropdown-item"
                    to="/detection"
                    onClick={close}
                  >
                    Run Detection
                  </NavLink>

                  <div className="ng-dropdown-divider" />

                  <button
                    className="ng-dropdown-item ng-logout"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Burger */}
        <button
          className={`ng-burger ${isOpen ? "ng-burger-open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="ng-mobile-menu">
          <ul>
            <li>
              <NavLink to="/" onClick={close}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/history" onClick={close}>
                History
              </NavLink>
            </li>
            {/* <li>
              <NavLink to="/detection" onClick={close}>
                Detect
              </NavLink>
            </li>
            <li>
              <NavLink to="/pricing" onClick={close}>
                Pricing
              </NavLink>
            </li> */}
          </ul>

          <div className="ng-mobile-auth">
            {!user ? (
              <>
                <NavLink to="/login" className="ng-btn-ghost" onClick={close}>
                  Log in
                </NavLink>
                <NavLink
                  to="/register"
                  className="ng-btn-primary"
                  onClick={close}
                >
                  Get Started
                </NavLink>
              </>
            ) : (
              <div className="ng-mobile-auth-col">
                <NavLink
                  className="ng-btn-primary"
                  to="/profile"
                  onClick={close}
                  style={{
                    marginBottom: "10px",
                    textAlign: "center",
                    display: "block",
                  }}
                >
                  My Profile
                </NavLink>
                <button
                  className="ng-btn-ghost"
                  onClick={handleLogout}
                  style={{ width: "100%" }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
