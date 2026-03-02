import "./HomeScreen.css";

export default function HomeScreen() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">

            {/* Left Content */}
            <div className="col-lg-6 hero-left">

              <div className="badge-box">
                <span>✔ Real-time protection enabled</span>
              </div>

              <h1 className="hero-title">
                Detect Phishing Attacks{" "}
                <span className="text-primary">
                  Before They Harm You
                </span>
              </h1>

              <p className="hero-text">
                Instant URL and email scanning to protect your digital identity
                from malicious threats in real-time. Secure your enterprise with
                AI-driven threat intelligence.
              </p>

              <div className="hero-buttons">
                <button className="btn btn-primary btn-lg">
                  Get Started →
                </button>

                <button className="btn btn-outline-dark btn-lg">
                  View Demo
                </button>
              </div>

              <div className="trusted-text">
                Trusted by 5,000+ security teams
              </div>

            </div>

            {/* Right Image */}
            <div className="col-lg-6 text-center hero-right">
              <div className="hero-image-wrapper">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHNmia_xBsEg5onTHyB2wkJkKu1xsWbvCYDs1YJZ98U4MBI1FcuKnYK_BLW9w6NoQt3GCgXErG-Lk3zvis6mRXa2irPHgUj9_kUII5Xt4AFnl-mWegcGGYARnMsz8WjmP5hsMnpfcVnH4BB8EjmZgh6j5X_H1MqJTnDg9L87d6yvFdouh6apUzZbkNB4j2V5R0XTkvhB6JwUOz_teRIZUipxW9qyfJrvFqWQSk9u8Qk64QWKsHkfED0jpUTMg_RsSAV2MRoehiRS0"
                  alt="Cybersecurity Dashboard"
                  className="img-fluid hero-img"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section">
        <div className="container text-center">
          <h6 className="section-label">CORE CAPABILITIES</h6>
          <h2 className="section-title">
            Advanced Protection Features
          </h2>

          <div className="row mt-5">

            <div className="col-md-4 mb-4">
              <div className="feature-card">
                <h5>URL Detection</h5>
                <p>
                  Analyze suspicious links in seconds with deep domain behavior analysis.
                </p>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="feature-card">
                <h5>Email Scanning</h5>
                <p>
                  Automated protection against spoofing and phishing attempts.
                </p>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="feature-card">
                <h5>Real-Time Alerts</h5>
                <p>
                  Immediate notifications sent when threats are detected.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section text-center">
        <div className="container">
          <h2>Ready to secure your digital life?</h2>
          <p>
            Join thousands of users who trust PhishShield for their daily security.
          </p>

          <div className="cta-buttons">
            <button className="btn btn-light btn-lg">
              Start Free Trial
            </button>

            <button className="btn btn-outline-light btn-lg">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </>
  );
}