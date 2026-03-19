import React, { useEffect, useState } from "react";
import "./Urls.css";
import "../pages/admin-shared.css";

export default function Urls() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUrlId, setExpandedUrlId] = useState(null);
  const [analyzingId, setAnalyzingId] = useState(null);

  const handleBadgeClick = async (item) => {
    if (!item.isSuspicious) return;
    const id = String(item._id);
    if (expandedUrlId === id) { setExpandedUrlId(null); return; }
    setExpandedUrlId(id);
    if (!item.details || item.details.length === 0) {
      setAnalyzingId(id);
      try {
        const res = await fetch(`http://localhost:8080/api/admin/urls/${id}/analyze`, {
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
      const res = await fetch("http://localhost:8080/api/admin/urls", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || "Failed to fetch URLs"); return; }
      setUrls(data);
    } catch { alert("Server error"); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="ap-loading"><div className="ap-spinner" /><p>Loading URLs…</p></div>;

  return (
    <div>
      <div className="ap-header">
        <h1>Suspicious URLs</h1>
        <p>All URLs flagged as suspicious by the AI detection engine</p>
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
            </tr>
          </thead>
          <tbody>
            {urls.length === 0 ? (
              <tr><td colSpan="5" className="no-data">No URLs found</td></tr>
            ) : (
              urls.map((item, index) => (
                <React.Fragment key={item._id}>
                  <tr>
                    <td>{index + 1}</td>
                    <td className="url-cell">{item.url}</td>
                    <td>{item.domain}</td>
                    <td>
                      <span
                        className={`ap-badge ${item.isSuspicious ? "ap-badge--high url-badge-click" : "ap-badge--safe"}`}
                        title={item.isSuspicious ? "Click to see details" : ""}
                        onClick={() => handleBadgeClick(item)}
                      >
                        {item.isSuspicious ? "Yes ▾" : "No"}
                      </span>
                    </td>
                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                  </tr>
                  {expandedUrlId === String(item._id) && item.isSuspicious && (
                    <tr className="url-details-row">
                      <td colSpan="5">
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
    </div>
  );
}
