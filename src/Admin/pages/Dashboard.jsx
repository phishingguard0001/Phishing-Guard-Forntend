import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Monitor reports, alerts, and suspicious activity at a glance</p>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-card stat-red">
          <div className="stat-title">Reported URLs</div>
          <div className="stat-value">128</div>
        </div>

        <div className="stat-card stat-yellow">
          <div className="stat-title">Pending Reports</div>
          <div className="stat-value">42</div>
        </div>

        <div className="stat-card stat-blue">
          <div className="stat-title">Suspicious Domains</div>
          <div className="stat-value">67</div>
        </div>

        <div className="stat-card stat-green">
          <div className="stat-title">Alerts Sent</div>
          <div className="stat-value">214</div>
        </div>
      </div>
    </div>
  );
}
