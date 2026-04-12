import "./App.css";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import AdminLayout from "./Admin/AdminLayout";
import Dashboard from "./Admin/pages/Dashboard";
import Users from "./Admin/pages/Users";
import Reports from "./Admin/pages/Reports";
import TotalScans from "./Admin/pages/TotalScans";
import Alerts from "./Admin/pages/Alerts";
import Urls from "./Admin/pages/Urls";
import Register from "./Auth/Register/Register";
import Login from "./Auth/Login/Login";
import ForgotPassword from "./Auth/ForgotPassword/ForgotPassword";

import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import HomeScreen from "./HomeScreen/HomeScreen";
import DetectionPage from "./DetectionPage/DetectionPage";
import HistoryPage from "./HistoryPage/HistoryPage";
import ReportPage from "./ReportPage/ReportPage";
import PricingPage from "./PricingPage/PricingPage";

import Profile from "./Profile/Profile";

// Helper component to guard routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (e) {}
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "admin" && !location.pathname.startsWith("/admin")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user?.role !== "admin" && location.pathname.startsWith("/admin")) {
    return <Navigate to="/detection" replace />;
  }

  return children;
};

// Helper component to prevent logged-in users from accessing auth pages
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (e) {}

  if (token) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/detection" replace />;
  }
  return children;
};

export default function App() {
  const location = useLocation();

  const hideLayout =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password";

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        {/* Public */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        {/* Protected User Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/detection"
          element={
            <ProtectedRoute>
              <DetectionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <ReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pricing"
          element={
            <ProtectedRoute>
              <PricingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="reports" element={<Reports />} />
          <Route path="scans" element={<TotalScans />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="urls" element={<Urls />} />
        </Route>
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}
