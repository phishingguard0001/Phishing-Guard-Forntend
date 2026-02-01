import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import HomeLayout from "./HomeScreen/HomeLayout";
import Navbar from "./Navbar/Navbar";
import Auth from "./Auth/Auth";

import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import Users from "./admin/pages/Users";
import Reports from "./admin/pages/Reports";
import Alerts from "./admin/pages/Alerts";
import Urls from "./admin/pages/Urls";

export default function App() {
  const location = useLocation();

  const hideNavbar = location.pathname.startsWith("/admin");
  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public */}
        <Route path="/" element={<HomeLayout />} />
        <Route path="/login" element={<Auth />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="reports" element={<Reports />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="urls" element={<Urls />} />
        </Route>
      </Routes>
    </>
  );
}
