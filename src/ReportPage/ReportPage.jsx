import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ReportPage.css";

export default function ReportPage() {
  const [url, setUrl] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // ✅ add this

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      alert("URL or Email is required");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8080/api/report",
        {
          url,
          threatLevel: "MEDIUM",
          riskScore: 50,
          confidence: 70,
          details: details ? [details] : [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Clear form
      setUrl("");
      setDetails("");

      // ✅ Redirect after success
      navigate("/detection");

    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-wrapper container py-5">

      <div className="text-center mb-5">
        <h1 className="report-title">Report a Phishing Attempt</h1>
        <p className="report-subtitle">
          Help us protect the community by reporting suspicious links or emails.
        </p>
      </div>

      <div className="report-card">

        <form onSubmit={handleSubmit}>

          {/* URL FIELD */}
          <div className="mb-4">
            <label className="form-label">
              Suspected URL or Email Address <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control report-input"
              placeholder="https://suspicious-site.com or sender@fakebank.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <small className="text-muted">
              Check for misspelled domains (e.g., amaz0n.com)
            </small>
          </div>

          {/* DETAILS */}
          <div className="mb-4">
            <label className="form-label">
              Additional Details (Optional)
            </label>
            <textarea
              className="form-control report-textarea"
              rows="5"
              placeholder="Describe why this looks suspicious..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          {/* BUTTONS */}
          <div className="d-flex gap-3">
            <button
              type="submit"
              className="btn btn-primary px-5"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>

            <button
              type="button"
              className="btn btn-light px-4"
              onClick={() => {
                setUrl("");
                setDetails("");
              }}
            >
              Cancel
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}