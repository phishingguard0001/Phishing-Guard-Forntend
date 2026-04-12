import "./Dashboard.css";
import "../pages/admin-shared.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  BarElement, CategoryScale, LinearScale,
} from "chart.js";
import { API_BASE } from "../../config/api";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const StatCard = ({ icon, label, value, color, onClick }) => (
  <div
    className="dash-stat"
    onClick={onClick}
    style={{ cursor: onClick ? "pointer" : "default", transition: "transform 0.18s, box-shadow 0.18s" }}
    onMouseEnter={(e) => { if (onClick) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.4)"; } }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
  >
    <div className="dash-stat-icon" style={{ background: color + "1a", color }}>{icon}</div>
    <div style={{ flex: 1 }}>
      <div className="dash-stat-label">{label}</div>
      <div className="dash-stat-value">{value}</div>
    </div>
    {onClick && (
      <div style={{ alignSelf: "flex-start", fontSize: "11px", color: "#475569", fontWeight: 600 }}>
        View all ↗
      </div>
    )}
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [reportTrend, setReportTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, tRes] = await Promise.all([
          axios.get(`${API_BASE}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE}/api/admin/reports-per-day`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setStats(sRes.data);

        // Build a full 30-day date range, filling missing days with 0
        const countMap = {};
        (tRes.data || []).forEach((item) => { countMap[item._id] = item.count; });

        const filled = [];
        for (let i = 29; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const key = d.toISOString().split("T")[0]; // "YYYY-MM-DD"
          filled.push({ _id: key, count: countMap[key] || 0 });
        }
        setReportTrend(filled);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
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

  // Format labels as "DD/MM" for readability
  const barLabels = reportTrend.map((i) => {
    const [y, m, d] = i._id.split("-");
    return `${d}/${m}`;
  });

  const barData = {
    labels: barLabels,
    datasets: [{
      label: "Scans per Day",
      data: reportTrend.map((i) => i.count),
      backgroundColor: "rgba(99,102,241,0.75)",
      borderColor: "#6366f1",
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const maxCount = Math.max(...reportTrend.map((i) => i.count), 0);
  const yMax = Math.max(10, Math.ceil(maxCount * 1.2));

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#94a3b8", font: { family: "Inter", size: 12 } } },
      tooltip: { callbacks: { title: (items) => `Date: ${reportTrend[items[0].dataIndex]?._id}` } },
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8", maxRotation: 45, minRotation: 45, font: { size: 10 } },
        grid: { color: "rgba(30,41,59,0.8)" },
        title: { display: true, text: "Date (DD/MM)", color: "#64748b", font: { family: "Inter", size: 12 } },
      },
      y: {
        min: 0,
        max: yMax,
        ticks: { color: "#94a3b8", stepSize: 1, precision: 0, font: { size: 11 } },
        grid: { color: "rgba(30,41,59,0.8)" },
        title: { display: true, text: "Number of Scans", color: "#64748b", font: { family: "Inter", size: 12 } },
      },
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
        <StatCard
          icon={<i className="fa-solid fa-magnifying-glass-chart"></i>}
          label="Total Scans"
          value={stats?.totalReports || 0}
          color="#6366f1"
          onClick={() => navigate("/admin/scans")}
        />
        <StatCard
          icon={<i className="fa-solid fa-flag"></i>}
          label="Reports"
          value={stats?.totalUserReports || 0}
          color="#22c55e"
          onClick={() => navigate("/admin/reports")}
        />
        <StatCard
          icon={<i className="fa-solid fa-triangle-exclamation"></i>}
          label="High Risk"
          value={stats?.high || 0}
          color="#f59e0b"
          onClick={() => navigate("/admin/urls?filter=SUSPICIOUS")}
        />
        <StatCard
          icon={<i className="fa-solid fa-link"></i>}
          label="Suspicious URLs"
          value={stats?.suspiciousUrls || 0}
          color="#ef4444"
          onClick={() => navigate("/admin/urls?filter=SUSPICIOUS")}
        />
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
          <h3 className="dash-chart-title">Scan Activity (Last 30 Days)</h3>
          <Bar data={barData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}