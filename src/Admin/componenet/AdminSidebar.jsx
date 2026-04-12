import { NavLink, useNavigate } from "react-router-dom";
import "./AdminSidebar.css";
import Logo from "../../assets/phishing_logo.png";

const navItems = [
  { to: "/admin/dashboard", icon: "fa-solid fa-chart-line",     label: "Dashboard" },
  { to: "/admin/users",     icon: "fa-solid fa-users",           label: "Users" },
  { to: "/admin/reports",   icon: "fa-solid fa-flag",            label: "Reports" },
  { to: "/admin/scans",     icon: "fa-solid fa-magnifying-glass-chart", label: "Total Scans" },
  { to: "/admin/urls",      icon: "fa-solid fa-link",            label: "Suspicious URLs" },
];

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace("/");  // replace() so Back arrow can't re-enter admin
  };

  return (
    <aside className="as-sidebar">
      {/* Brand */}
      <div className="as-brand" onClick={() => navigate("/")}>
        <img src={Logo} alt="PhishGuard" className="as-logo" />
        <div>
          <div className="as-brand-name">PhishGuard</div>
          <div className="as-brand-sub">Admin Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="as-nav">
        <div className="as-nav-label">NAVIGATION</div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `as-link${isActive ? " as-link--active" : ""}`}
          >
            <span className="as-link-icon"><i className={item.icon}></i></span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="as-footer">
        <div onClick={handleLogout} className="as-back-btn" style={{ cursor: "pointer" }}>
          <i className="fa-solid fa-right-from-bracket" style={{ marginRight: "8px" }}></i>Logout
        </div>
      </div>
    </aside>
  );
}