import { NavLink, useNavigate } from "react-router-dom";
import "./AdminSidebar.css";
import Logo from "../../assets/phishing_logo.png";

const navItems = [
  { to: "/admin/dashboard", icon: "📊", label: "Dashboard" },
  { to: "/admin/users",     icon: "👥", label: "Users" },
  { to: "/admin/reports",   icon: "🛡️", label: "Reports" },
  { to: "/admin/alerts",    icon: "🔔", label: "Alerts" },
  { to: "/admin/urls",      icon: "🔗", label: "Suspicious URLs" },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
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
            <span className="as-link-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="as-footer">
        <NavLink to="/" className="as-back-btn">
          ← Back to Website
        </NavLink>
      </div>
    </aside>
  );
}