import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faArrowLeft,
  faRotateRight,
  faUtensils,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import "./ErrorPage.css";

/**
 * Universal Error Page (404, 500, Network / Server errors)
 * Mobile-first down to 350px.
 */
const ErrorPage = ({
  code = "404",
  title = "Culinary Destination Not Found",
  message = "The dish, kitchen, or page you were looking for seems to have drifted off the menu or moved to another kitchen.",
  onRetry = null,
}) => {
  const navigate = useNavigate();

  return (
    <div className="universal-error-page d-flex align-items-center justify-content-center">
      <div className="error-card-box text-center">
        {/* Glow backdrop */}
        <div className="error-glow-circle" />

        {/* 3D Visual Code Badge */}
        <div className="error-code-badge mb-3">
          <span className="error-code-number">{code}</span>
          <span className="error-floating-icon">
            <FontAwesomeIcon icon={faUtensils} />
          </span>
        </div>

        {/* Main Heading & Message */}
        <h2 className="error-title mb-2">{title}</h2>
        <p className="error-description mx-auto mb-4">{message}</p>

        {/* Status indicator */}
        <div className="error-server-status d-inline-flex align-items-center gap-2 mb-4 py-1 px-3 rounded-pill">
          <FontAwesomeIcon icon={faShieldHalved} className="text-emerald" />
          <span>Cold Storage Protection Active • Render Live</span>
        </div>

        {/* Action Buttons */}
        <div className="error-actions-row d-flex flex-wrap justify-content-center gap-3">
          <Link to="/" className="error-btn-primary">
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Back to Home
          </Link>

          {onRetry ? (
            <button className="error-btn-secondary" onClick={onRetry}>
              <FontAwesomeIcon icon={faRotateRight} className="mr-2" />
              Try Again
            </button>
          ) : (
            <button className="error-btn-secondary" onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Previous Page
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
