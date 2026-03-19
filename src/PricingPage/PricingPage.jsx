import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PricingPage.css";

const plans = [
  {
    id: "free",
    name: "Free",
    badge: null,
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect for individuals getting started with phishing protection.",
    cta: "Get Started Free",
    ctaStyle: "outline",
    features: [
      { text: "50 URL scans / month", included: true },
      { text: "Basic email analysis", included: true },
      { text: "Threat level indicator", included: true },
      { text: "Scan history (7 days)", included: true },
      { text: "Real-time alerts", included: false },
      { text: "API access", included: false },
      { text: "Admin dashboard", included: false },
      { text: "Priority support", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    badge: "Most Popular",
    monthlyPrice: 1499,
    yearlyPrice: 999,
    description: "For professionals and small teams who need serious protection.",
    cta: "Start Pro Trial",
    ctaStyle: "primary",
    features: [
      { text: "5,000 URL scans / month", included: true },
      { text: "Advanced email analysis", included: true },
      { text: "Threat level indicator", included: true },
      { text: "Scan history (90 days)", included: true },
      { text: "Real-time alerts", included: true },
      { text: "API access (5k calls/mo)", included: true },
      { text: "Admin dashboard", included: false },
      { text: "Priority support", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    badge: null,
    monthlyPrice: 5999,
    yearlyPrice: 4499,
    description: "For organizations that demand enterprise-grade security at scale.",
    cta: "Contact Sales",
    ctaStyle: "dark",
    features: [
      { text: "Unlimited URL scans", included: true },
      { text: "AI-powered email analysis", included: true },
      { text: "Threat level indicator", included: true },
      { text: "Unlimited scan history", included: true },
      { text: "Real-time alerts + webhooks", included: true },
      { text: "Unlimited API access", included: true },
      { text: "Full admin dashboard", included: true },
      { text: "24/7 priority support", included: true },
    ],
  },
];

const faqs = [
  {
    q: "Can I upgrade or downgrade my plan anytime?",
    a: "Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades apply at the start of your next billing cycle.",
  },
  {
    q: "Is there a free trial for Pro and Enterprise?",
    a: "Pro plans include a 14-day free trial with no credit card required. Enterprise plans include a custom evaluation period arranged with our sales team.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and bank transfers for annual Enterprise plans.",
  },
  {
    q: "How does the API access work?",
    a: "Each plan comes with a unique API key. You can integrate PhishGuard's detection directly into your apps, email clients, or security pipelines.",
  },
  {
    q: "Is my data safe?",
    a: "All scanned data is encrypted in transit and at rest. We do not store or sell your scan content. Enterprise plans include dedicated data residency options.",
  },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  const handleCta = (plan) => {
    if (plan.id === "free") navigate("/register");
    else if (plan.id === "pro") navigate("/register");
    else window.location.href = "mailto:sales@phishguard.io";
  };

  return (
    <div className="pricing-page">

      {/* HERO */}
      <section className="pricing-hero">
        <div className="pricing-hero-glow" />
        <div className="container text-center">
          <span className="pricing-label">SIMPLE, TRANSPARENT PRICING</span>
          <h1 className="pricing-title">
            Choose the plan that<br />
            <span className="pricing-title-accent">fits your needs</span>
          </h1>
          <p className="pricing-subtitle">
            Start free. Scale as you grow. Cancel anytime. No hidden fees.
          </p>

          {/* Toggle */}
          <div className="billing-toggle">
            <span className={!yearly ? "toggle-active" : ""}>Monthly</span>
            <button
              className={`toggle-switch ${yearly ? "yearly" : ""}`}
              onClick={() => setYearly(!yearly)}
              aria-label="Toggle billing period"
            >
              <span className="toggle-thumb" />
            </button>
            <span className={yearly ? "toggle-active" : ""}>
              Yearly <span className="save-badge">Save 20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="pricing-cards-section">
        <div className="container">
          <div className="pricing-grid">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`pricing-card ${plan.id === "pro" ? "pricing-card--featured" : ""}`}
              >
                {plan.badge && (
                  <div className="pricing-card-badge">{plan.badge}</div>
                )}

                <div className="pricing-card-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-desc">{plan.description}</p>
                </div>

                <div className="plan-price-wrapper">
                  <div className="plan-price">
                    <span className="price-currency">₹</span>
                    <span className="price-amount">
                      {yearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="price-period">/mo</span>
                  </div>
                  {yearly && plan.monthlyPrice > 0 && (
                    <div className="price-savings">
                      Billed ₹{plan.yearlyPrice * 12}/yr — save ₹{(plan.monthlyPrice - plan.yearlyPrice) * 12}
                    </div>
                  )}
                </div>

                <button
                  className={`plan-cta plan-cta--${plan.ctaStyle}`}
                  onClick={() => handleCta(plan)}
                >
                  {plan.cta}
                </button>

                <ul className="plan-features">
                  {plan.features.map((f, i) => (
                    <li key={i} className={f.included ? "feature-yes" : "feature-no"}>
                      <span className="feature-icon">
                        {f.included ? "✓" : "✕"}
                      </span>
                      {f.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="trust-strip">
        <div className="container">
          <div className="trust-grid">
            {[
              { icon: "🛡️", label: "Enterprise-grade security" },
              { icon: "⚡", label: "99.9% uptime SLA" },
              { icon: "🔒", label: "SOC 2 compliant" },
              { icon: "🌍", label: "Used in 40+ countries" },
            ].map((t) => (
              <div className="trust-item" key={t.label}>
                <span className="trust-icon">{t.icon}</span>
                <span className="trust-label">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="comparison-section">
        <div className="container">
          <h2 className="comparison-title">Compare all features</h2>
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Free</th>
                  <th className="col-featured">Pro</th>
                  <th>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["URL Scans / month", "50", "5,000", "Unlimited"],
                  ["Email Analysis", "Basic", "Advanced", "AI-Powered"],
                  ["Scan History", "7 days", "90 days", "Unlimited"],
                  ["Real-time Alerts", "✕", "✓", "✓ + Webhooks"],
                  ["API Access", "✕", "5k calls/mo", "Unlimited"],
                  ["Admin Dashboard", "✕", "✕", "✓"],
                  ["Support", "Community", "Email", "24/7 Priority"],
                  ["Custom Integrations", "✕", "✕", "✓"],
                ].map(([feature, free, pro, ent]) => (
                  <tr key={feature}>
                    <td>{feature}</td>
                    <td>{free}</td>
                    <td className="col-featured">{pro}</td>
                    <td>{ent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container">
          <h2 className="faq-title">Frequently asked questions</h2>
          <div className="faq-list">
            {faqs.map((item, i) => (
              <div
                key={i}
                className={`faq-item ${openFaq === i ? "faq-item--open" : ""}`}
              >
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {item.q}
                  <span className="faq-icon">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="faq-answer">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BOTTOM */}
      <section className="pricing-cta">
        <div className="pricing-cta-glow" />
        <div className="container text-center">
          <h2 className="pricing-cta-title">Ready to protect your organization?</h2>
          <p className="pricing-cta-sub">
            Join 5,000+ security teams using PhishGuard. Start free, no credit card required.
          </p>
          <div className="pricing-cta-buttons">
            <button className="cta-btn-primary" onClick={() => navigate("/register")}>
              Start Free Today
            </button>
            <button className="cta-btn-secondary" onClick={() => navigate("/detection")}>
              Try a Free Scan
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
