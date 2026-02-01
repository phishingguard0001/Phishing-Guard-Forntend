import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import HomeLayout from "./HomeScreen/HomeLayout";
import Navbar from "./Navbar/Navbar";
import Auth from "./Auth/Auth";

import AdminLayout from "./Admin/AdminLayout";
import Dashboard from "./Admin/pages/Dashboard";
import Users from "./Admin/pages/Users";
import Reports from "./Admin/pages/Reports";
import Alerts from "./Admin/pages/Alerts";
import Urls from "./Admin/pages/Urls";


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
