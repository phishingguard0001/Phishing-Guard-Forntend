import "./Footer.css";
import { NavLink } from "react-router-dom";
import Logo from "./../assets/phishing_logo.png";

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="container">

        {/* TOP GRID */}
        <div className="row footer-top">

          {/* BRAND */}
          <div className="col-lg-4 col-md-12 mb-5">
            <div className="d-flex align-items-center mb-3">
              <img src={Logo} alt="PhishShield" className="footer-logo" />
            </div>

            <p className="footer-desc">
              The world's most advanced phishing detection system for modern
              enterprises and individuals.
            </p>

            <div className="footer-social">
              <i className="fab fa-twitter"></i>
              <i className="fab fa-linkedin-in ms-3"></i>
            </div>
          </div>

          {/* PRODUCT */}
          <div className="col-lg-2 col-md-4 mb-4">
            <h6 className="footer-heading">PRODUCT</h6>
            <ul className="list-unstyled footer-links">
              <li><NavLink to="/features">Features</NavLink></li>
              <li><NavLink to="/enterprise">Enterprise</NavLink></li>
              <li><NavLink to="/security">Security</NavLink></li>
              <li><NavLink to="/docs">API Docs</NavLink></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div className="col-lg-3 col-md-4 mb-4">
            <h6 className="footer-heading">COMPANY</h6>
            <ul className="list-unstyled footer-links">
              <li><NavLink to="/about">About Us</NavLink></li>
              <li><NavLink to="/careers">Careers</NavLink></li>
              <li><NavLink to="/contact">Contact Support</NavLink></li>
              <li><NavLink to="/trust">Trust Center</NavLink></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div className="col-lg-3 col-md-4 mb-4">
            <h6 className="footer-heading">LEGAL</h6>
            <ul className="list-unstyled footer-links">
              <li><NavLink to="/privacy">Privacy Policy</NavLink></li>
              <li><NavLink to="/terms">Terms of Service</NavLink></li>
              <li><NavLink to="/cookies">Cookie Policy</NavLink></li>
            </ul>
          </div>

        </div>

        {/* DIVIDER */}
        <hr />

        {/* BOTTOM */}
        <div className="d-flex justify-content-between align-items-center footer-bottom">

          <div>
            © 2024 PhishShield Inc. All rights reserved.
          </div>

          <div className="d-flex align-items-center">
            <i className="fas fa-globe me-2"></i> English
            <span className="status-dot ms-4 me-2"></span>
            Systems Operational
          </div>

        </div>

      </div>
    </footer>
  );
}