import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";

export default function AdminSidebar() {
  return (
    <div className="admin-sidebar d-flex flex-column">

      {/* Logo Section */}
      <div className="admin-logo text-center">
        <h4 className="mb-0">PhishGuard</h4>
        <small className="text-muted">Admin Panel</small>
      </div>

      {/* Navigation */}
      <nav className="nav flex-column mt-4">

        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-link admin-link active-admin" : "nav-link admin-link"
          }
        >
          <i className="fa-solid fa-chart-line me-2"></i>
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive ? "nav-link admin-link active-admin" : "nav-link admin-link"
          }
        >
          <i className="fa-solid fa-users me-2"></i>
          Users
        </NavLink>

        <NavLink
          to="/admin/reports"
          className={({ isActive }) =>
            isActive ? "nav-link admin-link active-admin" : "nav-link admin-link"
          }
        >
          <i className="fa-solid fa-file-shield me-2"></i>
          Reports
        </NavLink>

        <NavLink
          to="/admin/alerts"
          className={({ isActive }) =>
            isActive ? "nav-link admin-link active-admin" : "nav-link admin-link"
          }
        >
          <i className="fa-solid fa-bell me-2"></i>
          Alerts
        </NavLink>

        <NavLink
          to="/admin/urls"
          className={({ isActive }) =>
            isActive ? "nav-link admin-link active-admin" : "nav-link admin-link"
          }
        >
          <i className="fa-solid fa-link me-2"></i>
          Suspicious URLs
        </NavLink>

      </nav>

      {/* Bottom Section */}
      <div className="mt-auto p-3">
        <NavLink to="/" className="btn btn-outline-light w-100">
          <i className="fa-solid fa-arrow-left me-2"></i>
          Back to Website
        </NavLink>
      </div>

    </div>
  );
}