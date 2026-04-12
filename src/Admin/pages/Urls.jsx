import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./Urls.css";
import "../pages/admin-shared.css";
import { API_BASE } from "../../config/api";

export default function Urls() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUrlId, setExpandedUrlId] = useState(null);
  const [analyzingId, setAnalyzingId] = useState(null);
  
  const [reportModalData, setReportModalData] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const [filterMode, setFilterMode] = useState("ALL");
  const [sortMode, setSortMode] = useState("LATEST");
  const [searchParams] = useSearchParams();

  // Pre-apply filter from query string (e.g. ?filter=SUSPICIOUS from dashboard)
  useEffect(() => {
    const qf = searchParams.get("filter");
    if (qf === "SUSPICIOUS") setFilterMode("SUSPICIOUS");
    else if (qf === "SAFE") setFilterMode("SAFE");
    else if (qf === "ALL") setFilterMode("ALL");
  }, [searchParams]);

  const handleBadgeClick = async (item) => {
    if (!item.isSuspicious) return;
    const id = String(item._id);
    if (expandedUrlId === id) { setExpandedUrlId(null); return; }
    setExpandedUrlId(id);

    // Force re-analyze if details are missing OR only contain the stale "Phishing" string
    const stale =
      !item.details ||
      item.details.length === 0 ||
      (item.details.length === 1 && item.details[0].toLowerCase() === "phishing");

    if (stale) {
      setAnalyzingId(id);
      try {
        const res = await fetch(`${API_BASE}/api/admin/urls/${id}/analyze`, {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUrls(prev => prev.map(u => String(u._id) === id ? { ...u, details: data.details } : u));
        }
      } catch (e) { console.error("Analyze error:", e); }
      finally { setAnalyzingId(null); }
    }
  };

  useEffect(() => { fetchUrls(); }, []);

  const fetchUrls = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/urls`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Failed to fetch URLs"); return; }
      setUrls(data);
    } catch { alert("Server error"); }
    finally { setLoading(false); }
  };

  const handleViewReport = async (item) => {
    setLoadingReport(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/urls/${item._id}/report`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Could not find scanning report");
      } else {
        setReportModalData(data);
      }
    } catch (err) {
      alert("Failed to fetch report from server");
    } finally {
      setLoadingReport(false);
    }
  };

  const handleDeleteUrl = async (item) => {
    if (!window.confirm(`Delete this URL?\n\n${item.url}\n\nThis action cannot be undone.`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/urls/${item._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to delete URL");
      } else {
        setUrls(prev => prev.filter(u => String(u._id) !== String(item._id)));
        if (expandedUrlId === String(item._id)) setExpandedUrlId(null);
      }
    } catch (err) {
      alert("Server error while deleting URL");
    }
  };

  if (loading) return <div className="ap-loading"><div className="ap-spinner" /><p>Loading URLs…</p></div>;

  const displayedUrls = urls
    .filter((u) => {
      if (filterMode === "SUSPICIOUS") return u.isSuspicious;
      if (filterMode === "SAFE") return !u.isSuspicious;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortMode === "LATEST" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div>
      <div className="ap-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h1>Suspicious URLs</h1>
          <p>All URLs flagged as suspicious by the AI detection engine</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <select 
            value={filterMode} 
            onChange={(e) => setFilterMode(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "#f8fafc" }}
          >
            <option value="ALL">All URLs</option>
            <option value="SUSPICIOUS">Only Suspicious</option>
            <option value="SAFE">Not Suspicious</option>
          </select>
          <select 
            value={sortMode} 
            onChange={(e) => setSortMode(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "#f8fafc" }}
          >
            <option value="LATEST">Latest to Oldest</option>
            <option value="OLDEST">Oldest to Latest</option>
          </select>
        </div>
      </div>

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead>
            <tr>
              <th>#</th>
              <th>URL</th>
              <th>Domain</th>
              <th>Suspicious</th>
              <th>Added At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedUrls.length === 0 ? (
              <tr><td colSpan="6" className="no-data">No URLs found</td></tr>
            ) : (
              displayedUrls.map((item, index) => (
                <React.Fragment key={item._id}>
                  <tr 
                    className={item.isSuspicious ? "clickable-row" : ""}
                    onClick={() => item.isSuspicious && handleBadgeClick(item)}
                    title={item.isSuspicious ? "Click to see details" : ""}
                  >
                    <td>{index + 1}</td>
                    <td className="url-cell">{item.url}</td>
                    <td>{item.domain}</td>
                    <td>
                      <span
                        className={`ap-badge ${item.isSuspicious ? "ap-badge--high" : "ap-badge--safe"}`}
                      >
                        {item.isSuspicious ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        title="Delete this URL"
                        onClick={(e) => { e.stopPropagation(); handleDeleteUrl(item); }}
                        style={{
                          background: "rgba(239,68,68,0.15)",
                          border: "1px solid rgba(239,68,68,0.4)",
                          color: "#ef4444",
                          borderRadius: "8px",
                          padding: "5px 10px",
                          cursor: "pointer",
                          fontSize: "14px",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.35)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                  {expandedUrlId === String(item._id) && item.isSuspicious && (
                    <tr className="url-details-row">
                      <td colSpan="6">
                        <div className="url-details-content">
                          <div className="url-details-label">⚠️ Suspicious Reason:</div>
                          {analyzingId === String(item._id) ? (
                            <p className="url-analyzing">🔍 Analyzing URL…</p>
                          ) : item.details && item.details.length > 0 ? (
                            <ul className="url-details-list">
                              {item.details.map((d, i) => <li key={i}>{d}</li>)}
                            </ul>
                          ) : (
                            <p className="url-no-details">No additional details available.</p>
                          )}
                          <div style={{ marginTop: "15px" }}>
                            <button 
                              className="ap-btn-primary" 
                              style={{ padding: "8px 16px", background: "#6366f1", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
                              onClick={() => handleViewReport(item)}
                              disabled={loadingReport}
                            >
                              {loadingReport ? "Loading Report..." : "📄 View Original Scan Report"}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {reportModalData && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#1e293b", padding: "30px", borderRadius: "16px", maxWidth: "600px", width: "100%", maxHeight: "90vh", overflowY: "auto", color: "#f8fafc", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", border: "1px solid #334155" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, fontSize: "24px" }}>Original Scan Report</h2>
              <button 
                onClick={() => setReportModalData(null)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", fontSize: "24px", cursor: "pointer" }}
              >
                &times;
              </button>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
              <div style={{ background: "#0f172a", padding: "15px", borderRadius: "12px", border: "1px solid #334155" }}>
                <div style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "5px" }}>Threat Level</div>
                <div style={{ fontSize: "18px", fontWeight: "bold", color: reportModalData.threatLevel === "HIGH" ? "#ef4444" : reportModalData.threatLevel === "MEDIUM" ? "#f59e0b" : "#22c55e" }}>
                  {reportModalData.threatLevel}
                </div>
              </div>
              <div style={{ background: "#0f172a", padding: "15px", borderRadius: "12px", border: "1px solid #334155" }}>
                <div style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "5px" }}>Risk Score</div>
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>{reportModalData.riskScore || 0}/100</div>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "8px" }}>Original Input</div>
              <div style={{ background: "#0f172a", padding: "15px", borderRadius: "12px", border: "1px solid #334155", wordBreak: "break-all", fontSize: "14px" }}>
                {reportModalData.input}
              </div>
            </div>

            <div>
              <div style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "8px" }}>Detailed Findings</div>
              <div style={{ background: "#0f172a", padding: "15px", borderRadius: "12px", border: "1px solid #334155", fontSize: "14px", wordBreak: "break-all" }}>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#cbd5e1" }}>
                  {reportModalData.details?.map((detail, idx) => (
                    <li key={idx} style={{ marginBottom: "6px" }}>{detail}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
