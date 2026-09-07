import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../layout/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faCalendarAlt,
  faShieldAlt,
  faClipboardList,
  faCog,
  faEdit,
  faUtensils,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./Profile.css";

/**
 * Upgraded 3D Holographic RGB Profile Dashboard
 * Features real-time user identity, 3D animated avatar halo,
 * AI taste matrix, security credentials, and quick navigational pathways.
 */
const Profile = () => {
  const { user, loading } = useSelector((state) => state.user);

  if (loading) {
    return <Loader fullPage={true} message="Accessing secure profile vault..." />;
  }

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Active Member";

  return (
    <div className="profile-page-container">
      {/* 3D Ambient Background Glow */}
      <div className="profile-ambient-glow" />

      {/* Main 3D Holographic Card */}
      <div className="profile-card-3d">
        {/* Header Identity Banner */}
        <div className="profile-header-banner">
          <div className="profile-identity-group">
            {/* 3D Avatar Halo with Rotating RGB Orbit */}
            <div className="profile-avatar-halo">
              <img
                src={user?.avatar?.url || "/images/default_avatar.png"}
                alt={user?.name || "User Avatar"}
                className="profile-avatar-img"
                onError={(e) => {
                  e.target.src = "/images/default_avatar.png";
                }}
              />
              <span className="profile-vip-badge-mini" title="Verified Gourmet Member">
                ★
              </span>
            </div>

            <div>
              <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                <span className="profile-tag-pill">
                  ⚡ LEVEL 5 TASTE ARCHITECT
                </span>
                <span className="session-status-badge">
                  <FontAwesomeIcon icon={faShieldAlt} /> 7D SECURE SESSION
                </span>
              </div>
              <h1 className="profile-name-title">{user?.name || "Foodie Explorer"}</h1>
              <p className="text-muted mb-0 small">
                {user?.email || "Signed-in Culinary Aficionado"}
              </p>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="profile-header-actions">
            <Link to="/users/me/update" className="btn-profile-rgb" id="edit_profile">
              <FontAwesomeIcon icon={faEdit} />
              <span>Edit Profile</span>
            </Link>
            <Link to="/eats/orders/me/myOrders" className="btn-profile-ghost">
              <FontAwesomeIcon icon={faClipboardList} />
              <span>My Orders</span>
            </Link>
            <Link to="/users/me/settings" className="btn-profile-ghost">
              <FontAwesomeIcon icon={faCog} />
              <span>Settings</span>
            </Link>
          </div>
        </div>

        {/* 3D Interactive Stats Grid */}
        <div className="profile-stats-grid">
          <div className="profile-stat-box">
            <div className="stat-box-val">98%</div>
            <div className="stat-box-lbl">AI Food IQ</div>
          </div>
          <div className="profile-stat-box">
            <div className="stat-box-val">VIP</div>
            <div className="stat-box-lbl">Membership</div>
          </div>
          <div className="profile-stat-box">
            <div className="stat-box-val">Instant</div>
            <div className="stat-box-lbl">AI Recommendations</div>
          </div>
          <div className="profile-stat-box">
            <div className="stat-box-val">7 Days</div>
            <div className="stat-box-lbl">JWT Token Life</div>
          </div>
        </div>

        {/* Details & Preferences 2-Column Section */}
        <div className="profile-details-grid">
          {/* Left Column: Account Credentials */}
          <div className="profile-detail-card">
            <h3 className="detail-card-title">
              <FontAwesomeIcon icon={faUser} className="title-icon-cyan" />
              <span>Account Credentials</span>
            </h3>

            <div className="detail-info-row">
              <span className="detail-label">Full Name</span>
              <span className="detail-value">{user?.name || "Not provided"}</span>
            </div>

            <div className="detail-info-row">
              <span className="detail-label">Email Address</span>
              <span className="detail-value d-flex align-items-center gap-1 justify-content-end">
                <span>{user?.email || "Not provided"}</span>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  style={{ color: "#00f2fe", fontSize: "0.8rem" }}
                  title="Verified"
                />
              </span>
            </div>

            <div className="detail-info-row">
              <span className="detail-label">Account Role</span>
              <span className="detail-value text-capitalize">
                {user?.role || "Gourmet Consumer"}
              </span>
            </div>

            <div className="detail-info-row">
              <span className="detail-label">Member Since</span>
              <span className="detail-value">
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-1 text-muted" />{" "}
                {memberSince}
              </span>
            </div>
          </div>

          {/* Right Column: AI Taste Profile & Preferences */}
          <div className="profile-detail-card">
            <h3 className="detail-card-title">
              <FontAwesomeIcon icon={faUtensils} className="title-icon-magenta" />
              <span>AI Taste Matrix & Preferences</span>
            </h3>

            <p className="text-muted small mb-3">
              Chef Lumina automatically customizes live recommendations and culinary pairings based on these preferences:
            </p>

            <div className="taste-chips-wrap">
              <span className="taste-chip cyan">✨ Live Recommendations</span>
              <span className="taste-chip magenta">🥗 High Protein Focus</span>
              <span className="taste-chip amber">🌶️ Medium Spicy Tolerance</span>
              <span className="taste-chip">🍕 Artisanal Pairings</span>
              <span className="taste-chip cyan">🌱 Pure Veg Adaptable</span>
              <span className="taste-chip magenta">⚡ 3D Coverflow Browsing</span>
            </div>

            <div className="mt-4 pt-3 border-top border-secondary">
              <Link to="/users/me/settings" className="text-decoration-none small text-info d-flex align-items-center gap-1">
                <span>Tune AI Taste Model in Settings</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
