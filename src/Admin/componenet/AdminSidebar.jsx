import { NavLink } from "react-router-dom";
import "../admin.css";

export default function AdminSidebar() {
  return (
    <div className="admin-sidebar">
      <h2 className="logo">Phishing Guard</h2>

      <nav>
        <NavLink to="/admin/dashboard">Dashboard</NavLink>
        <NavLink to="/admin/users">Users</NavLink>
        <NavLink to="/admin/reports">Reports</NavLink>
        <NavLink to="/admin/alerts">Alerts</NavLink>
        <NavLink to="/admin/urls">Suspicious URLs</NavLink>
      </nav>
    </div>
  );
}
