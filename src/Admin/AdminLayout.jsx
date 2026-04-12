import AdminSidebar from "./componenet/AdminSidebar";
import { Outlet, Navigate } from "react-router-dom";
import "./admin.css";

export default function AdminLayout() {
  const token = localStorage.getItem("token");

  // If not logged in, send to homepage (replace so Back can't re-enter admin)
  if (!token) return <Navigate to="/" replace />;

  return (
    <div className="admin-wrapper">
      <AdminSidebar />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}