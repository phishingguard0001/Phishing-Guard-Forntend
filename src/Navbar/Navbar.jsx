import { useState, useRef, useEffect } from "react";
import "./Navbar.css";
import logo from "./../assets/phishing_logo.png";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [userOpen, setUserOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const userRef = useRef(null);

  /* ===== LOAD USER ===== */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  /* ===== CLOSE USER DROPDOWN ON OUTSIDE CLICK ===== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ===== LOGOUT ===== */
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setUserOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  /* ===== MOBILE NAV HANDLER ===== */
  const handleMobileNav = (path) => {
    setMenuOpen(false);
    if (path) navigate(path);
  };

  return (
    <>
      <nav className="navbar">
        {/* LEFT */}
        <div className="nav-left">
          <div className="logo" onClick={() => navigate("/")}>
            <img src={logo} alt="logo" />
          </div>
        </div>

        {/* CENTER MENU (DESKTOP) */}
        <ul className="nav-menu">
          <li onClick={() => navigate("/")}>Home</li>
          <li>Services</li>
          <li>Projects</li>
          <li>Pages</li>
          <li>Blog</li>
          <li>Contact Us</li>
        </ul>

        {/* RIGHT */}
        <div className="navbar-right">
          {/* HAMBURGER (MOBILE) */}
          <i
            className="fa-solid fa-bars hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          />

          {/* USER */}
          <div className="user-wrapper" ref={userRef}>
            <div
              className="user"
              onClick={() => {
                if (!user) navigate("/login");
                else setUserOpen((prev) => !prev);
              }}
            >
              <i className="fa-regular fa-user"></i>
              <span>{user ? user.email : "Account"} ▾</span>
            </div>

            {userOpen && user && (
              <div className="user-dropdown">
                <ul>
                  <li onClick={() => setUserOpen(false)}>Dashboard</li>
                  <li onClick={() => setUserOpen(false)}>Profile</li>
                  <li className="logout" onClick={handleLogout}>
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu">
          <ul>
            <li onClick={() => handleMobileNav("/")}>Home</li>
            <li onClick={() => handleMobileNav()}>Services</li>
            <li onClick={() => handleMobileNav()}>Projects</li>
            <li onClick={() => handleMobileNav()}>Pages</li>
            <li onClick={() => handleMobileNav()}>Blog</li>
            <li onClick={() => handleMobileNav()}>Contact Us</li>

            {!user && (
              <li onClick={() => handleMobileNav("/login")}>
                Login / Register
              </li>
            )}

            {user && (
              <li className="logout" onClick={handleLogout}>
                Logout
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
}
