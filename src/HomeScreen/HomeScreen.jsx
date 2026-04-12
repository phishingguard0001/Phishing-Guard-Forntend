import { useNavigate } from "react-router-dom";
import "./HomeScreen.css";


const stats = [
  { value: "5M+", label: "Threats Blocked" },
  { value: "99.9%", label: "Detection Accuracy" },
  { value: "5,000+", label: "Security Teams" },
  { value: "<2s", label: "Avg. Scan Time" },
];

const steps = [
  { num: "01", title: "Paste URL or Email", desc: "Drop in any suspicious link or paste an email body you want to verify." },
  { num: "02", title: "AI Analyzes It", desc: "Our model scans for phishing patterns, malicious domains, and social engineering signals." },
  { num: "03", title: "Get Your Result", desc: "Receive a detailed threat report with risk score, threat level, and specific reasons." },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CISO at FinSecure",
    avatar: "SC",
    color: "#6366f1",
    text: "PhishGuard caught a sophisticated spear-phishing campaign targeting our CFO. The AI found what our old tools missed completely.",
  },
  {
    name: "Marcus Delgado",
    role: "Security Engineer at DevCorp",
    avatar: "MD",
    color: "#06b6d4",
    text: "We integrated the API into our email pipeline in under an hour. Now every inbound email is scanned automatically. Game changer.",
  },
  {
    name: "Priya Nair",
    role: "IT Manager at RetailX",
    avatar: "PN",
    color: "#10b981",
    text: "The threat level indicators are so easy to understand. Even non-technical staff can act on the results immediately.",
  },
];

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="hs-page">

      {/* ─── HERO ─── */}
      <section className="hs-hero">
        <div className="hs-hero-glow hs-glow-top-left" />
        <div className="hs-hero-glow hs-glow-top-right" />

        <div className="container">
          <div className="hs-hero-inner">

            {/* Left */}
            <div className="hs-hero-left">
              <div className="hs-badge">
                <span className="hs-badge-dot" />
                Real-time AI protection enabled
              </div>

              <h1 className="hs-hero-title">
                Stop Phishing Attacks{" "}
                <span className="hs-hero-gradient">Before They Reach You</span>
              </h1>

              <p className="hs-hero-subtitle">
                Instant AI-powered URL and email scanning to protect your digital identity
                from malicious threats. Trusted by 5,000+ security teams worldwide.
              </p>

              <div className="hs-hero-actions">
                <button className="hs-btn-primary" onClick={() => navigate("/detection")}>
                  Scan Now — It's Free
                  <span className="hs-btn-arrow">→</span>
                </button>
                <button className="hs-btn-ghost" onClick={() => navigate("/pricing")}>
                  View Pricing
                </button>
              </div>

              <div className="hs-hero-trust">
                <span className="hs-trust-avatars">
                  {["A","B","C","D"].map((l, i) => (
                    <span key={i} className="hs-avatar" style={{ left: i * 24 + "px" }}>{l}</span>
                  ))}
                </span>
                <span className="hs-trust-text">
                  Joined by <strong>5,000+</strong> security professionals
                </span>
              </div>
            </div>

            {/* Right — Scan Mockup */}
            <div className="hs-hero-right">
              <div className="hs-scan-card">
                <div className="hs-scan-header">
                  <div className="hs-scan-dots">
                    {/* <span style={{ background: "#ef4444" }} />
                    <span style={{ background: "#f59e0b" }} />
                    <span style={{ background: "#22c55e" }} /> */}
                  </div>
                  <span className="hs-scan-title-bar">PhishGuard Threat Scanner</span>
                </div>

                <div className="hs-scan-body">
                  <div className="hs-scan-input-row">
                    <span className="hs-scan-lock"><i className="fa-solid fa-lock"></i></span>
                    <span className="hs-scan-url">http://secure-bank-login-update.com/verify</span>
                    <span className="hs-scan-tag hs-tag-danger">PHISHING</span>
                  </div>

                  <div className="hs-scan-result">
                    <div className="hs-result-header">
                      <span className="hs-result-icon hs-danger"><i className="fa-solid fa-triangle-exclamation"></i></span>
                      <div>
                        <div className="hs-result-label">Threat Level: HIGH</div>
                        <div className="hs-result-score">Risk Score: 94/100</div>
                      </div>
                    </div>

                    <div className="hs-findings">
                      <div className="hs-finding-label">Findings:</div>
                      {[
                        "Malicious URL detected",
                        "Suspicious domain pattern",
                        "No valid SSL certificate",
                      ].map((f) => (
                        <div className="hs-finding-item" key={f}>
                          <span className="hs-finding-dot" />
                          {f}
                        </div>
                      ))}
                    </div>

                    <div className="hs-scan-progress">
                      <div className="hs-progress-bar">
                        <div className="hs-progress-fill" style={{ width: "94%" }} />
                      </div>
                      <span>94%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating chips */}
              <div className="hs-chip hs-chip-1"><i className="fa-solid fa-circle-check" style={{ color: "#22c55e", marginRight: "6px" }}></i> 2.1M URLs scanned today</div>
              <div className="hs-chip hs-chip-2"><i className="fa-solid fa-shield-halved" style={{ color: "#6366f1", marginRight: "6px" }}></i> 99.9% accuracy</div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="hs-stats">
        <div className="container">
          <div className="hs-stats-grid">
            {stats.map((s) => (
              <div className="hs-stat-item" key={s.label}>
                <div className="hs-stat-value">{s.value}</div>
                <div className="hs-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ─── HOW IT WORKS ─── */}
      <section className="hs-how">
        <div className="container">
          <div className="hs-section-head">
            <span className="hs-section-label">HOW IT WORKS</span>
            <h2 className="hs-section-title">Threat detection in 3 steps</h2>
          </div>

          <div className="hs-steps-grid">
            {steps.map((s, i) => (
              <div className="hs-step" key={s.num}>
                <div className="hs-step-num">{s.num}</div>
                <h3 className="hs-step-title">{s.title}</h3>
                <p className="hs-step-desc">{s.desc}</p>
                {i < steps.length - 1 && <div className="hs-step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="hs-testimonials">
        <div className="container">
          <div className="hs-section-head">
            <span className="hs-section-label">TRUSTED BY SECURITY TEAMS</span>
            <h2 className="hs-section-title">What our users say</h2>
          </div>

          <div className="hs-testimonials-grid">
            {testimonials.map((t) => (
              <div className="hs-testimonial-card" key={t.name}>
                <div className="hs-quote">"</div>
                <p className="hs-testimonial-text">{t.text}</p>
                <div className="hs-testimonial-author">
                  <div className="hs-testimonial-avatar" style={{ background: t.color }}>{t.avatar}</div>
                  <div>
                    <div className="hs-testimonial-name">{t.name}</div>
                    <div className="hs-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="hs-cta">
        <div className="hs-cta-glow" />
        <div className="container text-center">
          <span className="hs-section-label">GET STARTED TODAY</span>
          <h2 className="hs-cta-title">Ready to secure your digital life?</h2>
          <p className="hs-cta-sub">
            Join thousands of users who trust PhishGuard for daily security protection.
            Start completely free — no credit card required.
          </p>
          <div className="hs-cta-actions">
            <button className="hs-btn-primary" onClick={() => navigate("/register")}>
              Create Free Account →
            </button>
            <button className="hs-btn-ghost" onClick={() => navigate("/detection")}>
              Try a Free Scan
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}