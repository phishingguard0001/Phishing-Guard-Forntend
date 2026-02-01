import AdminSidebar from "./componenet/AdminSidebar";
import { Outlet } from "react-router-dom";
import "./admin.css";

export default function AdminLayout() {
  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
