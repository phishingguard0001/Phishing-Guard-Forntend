import "./Dashboard.css";
import "../pages/admin-shared.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  LineElement, CategoryScale, LinearScale, PointElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const StatCard = ({ icon, label, value, color }) => (
  <div className="dash-stat">
    <div className="dash-stat-icon" style={{ background: color + "1a", color }}>{icon}</div>
    <div>
      <div className="dash-stat-label">{label}</div>
      <div className="dash-stat-value">{value}</div>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [reportTrend, setReportTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetch = async () => {
      try {
        const [sRes, tRes] = await Promise.all([
          axios.get("http://localhost:8080/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:8080/api/admin/reports-per-day", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setStats(sRes.data);
        setReportTrend(tRes.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [token]);

  if (loading) return (
    <div className="ap-loading">
      <div className="ap-spinner" />
      <p>Loading dashboard…</p>
    </div>
  );

  const doughnutData = {
    labels: ["High Risk", "Medium Risk", "Safe"],
    datasets: [{
      data: [stats?.high || 0, stats?.medium || 0, stats?.safe || 0],
      backgroundColor: ["#ef4444", "#f59e0b", "#22c55e"],
      borderColor: ["#1e293b", "#1e293b", "#1e293b"],
      borderWidth: 3,
    }],
  };

  const lineData = {
    labels: reportTrend.map((i) => i._id),
    datasets: [{
      label: "Reports",
      data: reportTrend.map((i) => i.count),
      borderColor: "#6366f1",
      backgroundColor: "rgba(99,102,241,0.1)",
      tension: 0.4,
      fill: true,
      pointBackgroundColor: "#6366f1",
      pointRadius: 5,
    }],
  };

  const chartOptions = {
    plugins: { legend: { labels: { color: "#64748b", font: { family: "Inter" } } } },
    scales: {
      x: { ticks: { color: "#475569" }, grid: { color: "#1e293b" } },
      y: { ticks: { color: "#475569" }, grid: { color: "#1e293b" } },
    },
  };

  const doughnutOptions = {
    plugins: { legend: { labels: { color: "#64748b", font: { family: "Inter" } } } },
  };

  return (
    <div>
      <div className="ap-header">
        <h1>Admin Dashboard</h1>
        <p>Monitor reports, alerts, and suspicious activity in real-time</p>
      </div>

      {/* Stat Cards */}
      <div className="dash-stats">
        <StatCard icon="📋" label="Total Reports"    value={stats?.totalReports   || 0} color="#ef4444" />
        <StatCard icon="⚠️" label="High Risk"         value={stats?.high          || 0} color="#f59e0b" />
        <StatCard icon="🔗" label="Suspicious URLs"  value={stats?.suspiciousUrls || 0} color="#6366f1" />
        <StatCard icon="🔔" label="Alerts Sent"      value={stats?.totalAlerts    || 0} color="#22c55e" />
      </div>

      {/* Charts */}
      <div className="dash-charts">
        <div className="dash-chart-card">
          <h3 className="dash-chart-title">Threat Distribution</h3>
          <div className="dash-doughnut-wrap">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        <div className="dash-chart-card">
          <h3 className="dash-chart-title">Reports (Last 7 Days)</h3>
          <Line data={lineData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}