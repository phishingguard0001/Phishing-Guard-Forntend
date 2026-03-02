import AdminSidebar from "./componenet/AdminSidebar";
import { Outlet } from "react-router-dom";
import "./admin.css";

export default function AdminLayout() {
  return (
    <div className="admin-wrapper">
      <AdminSidebar />
      
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}