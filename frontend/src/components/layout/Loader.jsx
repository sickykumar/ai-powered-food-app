import React from "react";
import "./Loader.css";

/**
 * Universal Luxury Loader Component
 * Supports both full-page blocking load and embedded section loading.
 * Fully mobile-first down to 350px.
 */
const Loader = ({ fullPage = false, message = "Curating Gastronomic Intelligence..." }) => {
  return (
    <div className={`universal-loader-container ${fullPage ? "full-page-loader" : "inline-loader"}`}>
      <div className="loader-orbit-wrapper">
        {/* Glowing Outer Orbit */}
        <div className="loader-ring-outer" />
        {/* Counter-rotating Inner Orbit */}
        <div className="loader-ring-inner" />
        {/* Core Center Pulse */}
        <div className="loader-core-icon">
          <span>⚡</span>
        </div>
      </div>

      {/* Animated Text */}
      <h5 className="loader-main-text mt-3 mb-1">{message}</h5>
      <p className="loader-sub-text">
        <span className="loader-pulse-dot" /> Connecting to live cloud kitchens & cold storage keeper...
      </p>
    </div>
  );
};

export default Loader;
