import { useEffect, useState } from "react";
import "./Reports.css";
import "../pages/admin-shared.css";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/report/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Failed to fetch reports"); return; }
      setReports(data.reports);
    } catch (err) { console.error(err); alert("Server error"); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="ap-loading"><div className="ap-spinner" /><p>Loading reports…</p></div>;

  return (
    <div>
      <div className="ap-header">
        <h1>Reported URLs</h1>
        <p>{reports.length} report{reports.length !== 1 ? "s" : ""} submitted by users</p>
      </div>

      <div className="ap-table-wrap">
        <table className="ap-table">
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
              <tr><td colSpan="6" className="no-data">No reports found</td></tr>
            ) : (
              reports.map((r, i) => (
                <tr key={r._id}>
                  <td>{i + 1}</td>
                  <td>{r.user?.email || "—"}</td>
                  <td className="reports-url">{r.url}</td>
                  <td>{r.description || "—"}</td>
                  <td>
                    <span className={`ap-badge ap-badge--${r.status === "pending" ? "pending" : "resolved"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
