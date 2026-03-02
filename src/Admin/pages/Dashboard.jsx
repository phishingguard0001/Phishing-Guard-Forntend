import "./Dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [reportTrend, setReportTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch Stats
        const statsRes = await axios.get(
          "https://phishing-guard-6m3y.onrender.com/api/admin/stats",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setStats(statsRes.data);

        // Fetch Trend
        const trendRes = await axios.get(
          "https://phishing-guard-6m3y.onrender.com/api/admin/reports-per-day",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setReportTrend(trendRes.data);

        setLoading(false);
      } catch (error) {
        console.error("Dashboard error:", error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, [token]);

  if (loading) {
    return (
      <div className="dashboard-container text-center mt-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-3">Loading dashboard...</p>
      </div>
    );
  }

  // ---------------- Doughnut Chart ----------------
  const doughnutData = {
    labels: ["High Risk", "Medium Risk", "Safe"],
    datasets: [
      {
        data: [
          stats?.high || 0,
          stats?.medium || 0,
          stats?.safe || 0,
        ],
        backgroundColor: ["#dc3545", "#ffc107", "#198754"],
        borderWidth: 0,
      },
    ],
  };

  // ---------------- Line Chart ----------------
  const lineData = {
    labels: reportTrend.map((item) => item._id),
    datasets: [
      {
        label: "Reports",
        data: reportTrend.map((item) => item.count),
        borderColor: "#1555c0",
        backgroundColor: "rgba(21,85,192,0.15)",
        tension: 0.4,
        fill: true,
        pointRadius: 4,
      },
    ],
  };

  return (
    <div className="dashboard-container">

      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Monitor reports, alerts, and suspicious activity</p>
      </div>

      {/* ---------------- Stat Cards ---------------- */}
      <div className="dashboard-stats">
        <div className="stat-card stat-red">
          <div className="stat-title">Total Reports</div>
          <div className="stat-value">{stats?.totalReports || 0}</div>
        </div>

        <div className="stat-card stat-yellow">
          <div className="stat-title">High Risk</div>
          <div className="stat-value">{stats?.high || 0}</div>
        </div>

        <div className="stat-card stat-blue">
          <div className="stat-title">Suspicious URLs</div>
          <div className="stat-value">{stats?.suspiciousUrls || 0}</div>
        </div>

        <div className="stat-card stat-green">
          <div className="stat-title">Alerts Sent</div>
          <div className="stat-value">{stats?.totalAlerts || 0}</div>
        </div>
      </div>

      {/* ---------------- Charts Row ---------------- */}
      <div className="row mt-5">

        <div className="col-lg-5">
          <div className="chart-card p-4 bg-white rounded shadow-sm">
            <h5 className="mb-4">Threat Distribution</h5>
            <Doughnut data={doughnutData} />
          </div>
        </div>

        <div className="col-lg-7">
          <div className="chart-card p-4 bg-white rounded shadow-sm">
            <h5 className="mb-4">Reports (Last 7 Days)</h5>
            <Line data={lineData} />
          </div>
        </div>

      </div>

    </div>
  );
}