import "./Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "./../assets/phishing_logo.png";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // 👈 control collapse
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const username = parsedUser.email.split("@")[0];
      setUser({ ...parsedUser, username });
    } else {
      setUser(null);
    }
  }, [location]); // 👈 this is the fix
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
    setIsOpen(false); // close on logout
  };

  const closeNavbar = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container">
        {/* Logo */}
        <NavLink
          className="navbar-brand brand-logo"
          to="/"
          onClick={closeNavbar}
        >
          <img src={Logo} alt="PhishGuard Logo" className="logo-img" />
        </NavLink>

        {/* Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapse */}
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <NavLink to="/" className="nav-link" onClick={closeNavbar}>
                Features
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/detection"
                className="nav-link"
                onClick={closeNavbar}
              >
                Detect
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/pricing" className="nav-link" onClick={closeNavbar}>
                Pricing
              </NavLink>
            </li>
          </ul>

          <div className="d-flex flex-column flex-lg-row gap-2">
            {!user ? (
              <>
                <NavLink
                  to="/login"
                  className="btn btn-outline-primary"
                  onClick={closeNavbar}
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className="btn btn-primary"
                  onClick={closeNavbar}
                >
                  Signup
                </NavLink>
              </>
            ) : (
              <div className="dropdown">
                <button
                  className="btn profile-btn dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  {user.username}
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <NavLink
                      className="dropdown-item"
                      to="/profile"
                      onClick={closeNavbar}
                    >
                      My Profile
                    </NavLink>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
