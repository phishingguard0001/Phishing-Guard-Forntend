import { useEffect, useState } from "react";
import "./Reports.css";
import "../pages/admin-shared.css";
import { API_BASE } from "../../config/api";

const LEVEL_CLASS = {
  HIGH:   "ap-badge--high",
  MEDIUM: "ap-badge--medium",
  SAFE:   "ap-badge--safe",
};

export default function Reports() {
  const [reports, setReports]     = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [levelFilter, setLevel]   = useState("ALL");
  const [expandedId, setExpanded] = useState(null);

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch(`${API_BASE}/api/report/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { console.error(data.message); return; }
      const list = data.reports || data;
      setReports(list);
      setFiltered(list);
    } catch (err) { console.error("Fetch reports error:", err); }
    finally { setLoading(false); }
  };

  /* filter + search */
  useEffect(() => {
    let list = reports;
    if (levelFilter !== "ALL") list = list.filter(r => r.threatLevel === levelFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r =>
        (r.user?.email || "").toLowerCase().includes(q) ||
        (r.url || "").toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [search, levelFilter, reports]);

  if (loading) return (
    <div className="ap-loading">
      <div className="ap-spinner" />
      <p>Loading reports…</p>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="ap-header" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:"20px" }}>
        <div>
          <h1>User Reports</h1>
          <p>{filtered.length} report{filtered.length !== 1 ? "s" : ""} submitted by users after scans</p>
        </div>
        <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search email or URL…"
            style={{ padding:"8px 12px", borderRadius:"8px", border:"1px solid #334155", background:"#0f172a", color:"#f8fafc", minWidth:"200px" }}
          />
          <select
            value={levelFilter}
            onChange={e => setLevel(e.target.value)}
            style={{ padding:"8px 12px", borderRadius:"8px", border:"1px solid #334155", background:"#0f172a", color:"#f8fafc" }}
          >
            <option value="ALL">All Levels</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium</option>
            <option value="SAFE">Safe</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User Email</th>
              <th>URL / Content</th>
              <th>Level</th>
              <th>Risk Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="6" className="no-data">No reports found</td></tr>
            ) : (
              filtered.map((r, i) => {
                const isExpanded = expandedId === r._id;
                const short = r.url?.length > 60 ? r.url.slice(0, 60) + "…" : r.url;
                return (
                  <tr
                    key={r._id}
                    style={{ cursor: r.url?.length > 60 ? "pointer" : "default" }}
                    onClick={() => r.url?.length > 60 && setExpanded(isExpanded ? null : r._id)}
                  >
                    <td>{i + 1}</td>
                    <td>{r.user?.email || "—"}</td>
                    <td className="reports-url" title={r.url}>
                      {isExpanded ? r.url : short}
                      {r.url?.length > 60 && (
                        <span style={{ marginLeft:"6px", fontSize:"11px", color:"#6366f1", fontWeight:600 }}>
                          {isExpanded ? "▴ less" : "▾ more"}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`ap-badge ${LEVEL_CLASS[r.threatLevel] || ""}`}>
                        {r.threatLevel}
                      </span>
                    </td>
                    <td>{r.riskScore ?? "—"}/100</td>
                    <td>{new Date(r.createdAt).toLocaleString()}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
