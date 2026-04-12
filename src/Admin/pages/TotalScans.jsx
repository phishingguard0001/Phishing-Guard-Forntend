import { useEffect, useState } from "react";
import "./Reports.css";
import "../pages/admin-shared.css";
import { API_BASE } from "../../config/api";

const LEVEL_CLASS = { HIGH: "ap-badge--high", MEDIUM: "ap-badge--medium", SAFE: "ap-badge--safe" };

export default function TotalScans() {
  const [detections, setDetections] = useState([]);
  const [filtered, setFiltered]     = useState([]);
  const [loading, setLoading]        = useState(true);
  const [search, setSearch]          = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [expandedId, setExpandedId]  = useState(null);

  useEffect(() => { fetchDetections(); }, []);

  const fetchDetections = async () => {
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch(`${API_BASE}/api/admin/detections`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) { console.error(data.message); return; }
      setDetections(data);
      setFiltered(data);
    } catch (err) { console.error("Fetch detections error:", err); }
    finally { setLoading(false); }
  };

  /* filter + search */
  useEffect(() => {
    let list = detections;
    if (levelFilter !== "ALL") list = list.filter(d => d.threatLevel === levelFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(d =>
        (d.user?.email || "").toLowerCase().includes(q) ||
        (d.input || "").toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [search, levelFilter, detections]);

  if (loading) return <div className="ap-loading"><div className="ap-spinner" /><p>Loading scans…</p></div>;

  return (
    <div>
      <div className="ap-header" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:"20px" }}>
        <div>
          <h1>Total Scans</h1>
          <p>{filtered.length} scan{filtered.length !== 1 ? "s" : ""} recorded by the AI engine</p>
        </div>
        <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search email or input…"
            style={{ padding:"8px 12px", borderRadius:"8px", border:"1px solid #334155", background:"#0f172a", color:"#f8fafc", minWidth:"200px" }}
          />
          <select
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value)}
            style={{ padding:"8px 12px", borderRadius:"8px", border:"1px solid #334155", background:"#0f172a", color:"#f8fafc" }}
          >
            <option value="ALL">All Levels</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium</option>
            <option value="SAFE">Safe</option>
          </select>
        </div>
      </div>

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User Email</th>
              <th>Input (URL / Email)</th>
              <th>Level</th>
              <th>Risk Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="6" className="no-data">No scans found</td></tr>
            ) : (
              filtered.map((d, i) => {
                const isExpanded = expandedId === d._id;
                const short = d.input?.length > 60 ? d.input.slice(0, 60) + "…" : d.input;
                return (
                  <>
                    <tr key={d._id} style={{ cursor: d.input?.length > 60 ? "pointer" : "default" }}
                        onClick={() => d.input?.length > 60 && setExpandedId(isExpanded ? null : d._id)}>
                      <td>{i + 1}</td>
                      <td>{d.user?.email || "—"}</td>
                      <td className="reports-url" title={d.input}>
                        {isExpanded ? d.input : short}
                        {d.input?.length > 60 && (
                          <span style={{ marginLeft:"6px", fontSize:"11px", color:"#6366f1", fontWeight:600 }}>
                            {isExpanded ? "▴ less" : "▾ more"}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`ap-badge ${LEVEL_CLASS[d.threatLevel] || ""}`}>
                          {d.threatLevel}
                        </span>
                      </td>
                      <td>{d.riskScore ?? "—"}/100</td>
                      <td>{new Date(d.createdAt).toLocaleString()}</td>
                    </tr>
                  </>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
