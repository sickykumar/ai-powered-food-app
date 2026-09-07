import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldHalved,
  faHeart,
  faServer,
  faLeaf,
} from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer className="nextgen-footer mt-5 pt-5 pb-4">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Col 1: Brand & AI mission */}
          <div className="col-12 col-lg-4 mb-4 mb-lg-0">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="logo-sparkle text-emerald">✦</span>
              <span className="footer-brand-name">OrderIt AI</span>
              <span className="ai-chip-pill">Next-Gen</span>
            </div>
            <p className="footer-bio text-muted">
              Hyper-personalized culinary recommendations, instant gourmet feasts,
              and real-time nutrition balancing powered by advanced AI and instant cloud delivery.
            </p>
            <div className="d-flex align-items-center gap-2 mt-3">
              <span className="status-indicator-pill">
                <FontAwesomeIcon icon={faServer} className="text-success mr-1" />
                Render Cold Storage Guard: <strong>Active</strong>
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="footer-title">Discover</h6>
            <ul className="footer-links-list list-unstyled">
              <li><Link to="/">Explore Feasts</Link></li>
              <li><Link to="/cart">My Cart</Link></li>
              <li><Link to="/users/login">Sign In</Link></li>
              <li><Link to="/users/signup">Create Account</Link></li>
            </ul>
          </div>

          {/* Col 3: AI Capabilities */}
          <div className="col-6 col-md-3 col-lg-3">
            <h6 className="footer-title">AI Engine</h6>
            <ul className="footer-links-list list-unstyled">
              <li><span>🧠 Chef Lumina Bot</span></li>
              <li><span>🥗 Smart Calorie Estimator</span></li>
              <li><span>💬 Review Sentiment Analysis</span></li>
              <li><span>⚡ Keep-Warm Heartbeat</span></li>
            </ul>
          </div>

          {/* Col 4: Trust & Guarantees */}
          <div className="col-12 col-md-6 col-lg-3">
            <h6 className="footer-title">Trust & Safety</h6>
            <div className="trust-card p-3 rounded mb-2">
              <div className="d-flex align-items-center gap-2 mb-1">
                <FontAwesomeIcon icon={faShieldHalved} className="text-emerald" />
                <strong>100% Secure Checkout</strong>
              </div>
              <small className="text-muted d-block">
                Powered by Stripe & encrypted end-to-end payment pipelines.
              </small>
            </div>
            <div className="trust-card p-3 rounded">
              <div className="d-flex align-items-center gap-2 mb-1">
                <FontAwesomeIcon icon={faLeaf} className="text-success" />
                <strong>Pure Veg Verification</strong>
              </div>
              <small className="text-muted d-block">
                Separate kitchens and strictly audited cooking procedures.
              </small>
            </div>
          </div>
        </div>

        <hr className="footer-divider my-4" />

        <div className="d-flex flex-wrap justify-content-between align-items-center text-muted gap-3" style={{ fontSize: "0.88rem" }}>
          <p className="mb-0">
            © {new Date().getFullYear()} OrderIt AI Food Technologies. All rights reserved.
          </p>
          <div className="made-by-badge d-inline-flex align-items-center gap-2 py-1 px-3 rounded-pill" style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
            <span className="text-light">Made with purely <FontAwesomeIcon icon={faHeart} className="text-danger mx-1" /> by <strong className="text-emerald">Sicky Kumar</strong></span>
            <span className="text-muted">•</span>
            <a
              href="https://sickykumar.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none fw-bold"
              style={{ color: "#38bdf8", transition: "color 0.2s ease" }}
            >
              Portfolio: sickykumar.in ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
