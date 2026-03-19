import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";

import AdminLayout from "./Admin/AdminLayout";
import Dashboard from "./Admin/pages/Dashboard";
import Users from "./Admin/pages/Users";
import Reports from "./Admin/pages/Reports";
import Alerts from "./Admin/pages/Alerts";
import Urls from "./Admin/pages/Urls";
import Register from "./Auth/Register/Register";
import Login from "./Auth/Login/Login";

import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import HomeScreen from "./HomeScreen/HomeScreen";
import DetectionPage from "./DetectionPage/DetectionPage";
import ReportPage from "./ReportPage/ReportPage";
import PricingPage from "./PricingPage/PricingPage";

export default function App() {
  const location = useLocation();

  const hideNavbar = location.pathname.startsWith("/admin");
  const hideFooter = location.pathname.startsWith("/admin");
  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomeScreen/>}/>
        <Route path="/detection" element={<DetectionPage/>}/>
        <Route path="/report" element={<ReportPage/>}/>
        <Route path="/pricing" element={<PricingPage/>}/>

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="reports" element={<Reports />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="urls" element={<Urls />} />
        </Route>
      </Routes>

      {!hideFooter && <Footer />}
    </>
  );
}
