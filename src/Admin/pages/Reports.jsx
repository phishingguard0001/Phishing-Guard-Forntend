import { useEffect, useState } from "react";
import "./Reports.css";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch("https://phishing-guard-6m3y.onrender.com/api/report/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to fetch reports");
        return;
      }

      setReports(data);
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading-text">Loading reports...</p>;

  return (
    <div className="reports-container">
      <h2>Reported URLs</h2>

      <div className="reports-table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User Email</th>
              <th>URL</th>
              <th>Description</th>
              <th>Status</th>
              <th>Reported At</th>
            </tr>
          </thead>

          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No reports found
                </td>
              </tr>
            ) : (
              reports.map((report, index) => (
                <tr key={report._id}>
                  <td>{index + 1}</td>
                  <td>{report.user?.email || "-"}</td>
                  <td>{report.url}</td>
                  <td>{report.description || "-"}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        report.status === "pending"
                          ? "status-pending"
                          : "status-resolved"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td>{new Date(report.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
