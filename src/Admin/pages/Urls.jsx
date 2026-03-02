import { useEffect, useState } from "react";
import "./Urls.css";

export default function Urls() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const res = await fetch("https://phishing-guard-6m3y.onrender.com/api/admin/urls", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to fetch URLs");
        return;
      }

      setUrls(data);
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };



  if (loading) return <p className="loading-text">Loading URLs...</p>;

  return (
    <div className="urls-container">
      <h2>Suspicious URLs</h2>

      {/* Table */}
      <div className="urls-table-wrapper">
        <table className="urls-table">
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
              <tr>
                <td colSpan="5" className="no-data">
                  No URLs found
                </td>
              </tr>
            ) : (
              urls.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.url}</td>
                  <td>{item.domain}</td>
                  <td>
                    <span
                      className={`badge ${
                        item.isSuspicious
                          ? "badge-danger"
                          : "badge-success"
                      }`}
                    >
                      {item.isSuspicious ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
