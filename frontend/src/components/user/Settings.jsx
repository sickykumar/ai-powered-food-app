import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, loadUser } from "../../redux/actions/userActions";
import { clearErrors, updateReset } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSlidersH,
  faShieldAlt,
  faPalette,
  faCheck,
  faSave,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import AvatarPresetSelector from "./AvatarPresetSelector";
import "./Settings.css";
import "./Auth.css";

const Settings = () => {
  const dispatch = useDispatch();
  const { user, error, isUpdated, loading } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("profile");

  // Profile Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.png");

  // AI & Taste Settings (persisted in localStorage)
  const [pureVegOnly, setPureVegOnly] = useState(() => {
    return localStorage.getItem("ai_pref_veg") === "true";
  });
  const [spiceLevel, setSpiceLevel] = useState(() => {
    return localStorage.getItem("ai_pref_spice") || "medium";
  });
  const [aiPairingsEnabled, setAiPairingsEnabled] = useState(() => {
    return localStorage.getItem("ai_pref_pairings") !== "false";
  });
  const [smoothNav, setSmoothNav] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setAvatarPreview(user?.avatar?.url || "/images/default_avatar.png");
    }

    if (error) {
      toast.error(error);
      if (
        typeof error === "string" &&
        (error.toLowerCase().includes("token is invalid") ||
          error.toLowerCase().includes("token is expired") ||
          error.toLowerCase().includes("please log in"))
      ) {
        toast.info("JWT key update hui hai. Kripya ek baar Logout karke wapas Login karein.");
      }
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Settings updated successfully!");
      dispatch(loadUser());
      dispatch(updateReset());
    }
  }, [dispatch, error, isUpdated, user]);

  const handleAvatarChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    if (avatar) {
      formData.set("avatar", avatar);
    }
    dispatch(updateProfile(formData));
  };

  const handleTastePreferencesSave = () => {
    localStorage.setItem("ai_pref_veg", pureVegOnly);
    localStorage.setItem("ai_pref_spice", spiceLevel);
    localStorage.setItem("ai_pref_pairings", aiPairingsEnabled);
    toast.success("AI Taste Matrix preferences saved!");
  };

  return (
    <div className="settings-page-container">
      {/* 3D Ambient Glow */}
      <div className="settings-ambient-glow" />

      <div className="settings-card-3d">
        {/* Header */}
        <div className="settings-header">
          <span className="settings-pill">⚡ SYSTEM CONFIG</span>
          <h1 className="settings-title">Settings & Preferences</h1>
          <p className="settings-subtitle">
            Configure your account identity, fine-tune the AI Culinary Model, and customize your 3D RGB experience.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="settings-tabs-bar">
          <button
            className={`settings-tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <FontAwesomeIcon icon={faUser} />
            <span>Profile Identity</span>
          </button>
          <button
            className={`settings-tab-btn ${activeTab === "ai" ? "active" : ""}`}
            onClick={() => setActiveTab("ai")}
          >
            <FontAwesomeIcon icon={faSlidersH} />
            <span>AI Taste Matrix</span>
          </button>
          <button
            className={`settings-tab-btn ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <FontAwesomeIcon icon={faShieldAlt} />
            <span>Security & Token</span>
          </button>
          <button
            className={`settings-tab-btn ${activeTab === "theme" ? "active" : ""}`}
            onClick={() => setActiveTab("theme")}
          >
            <FontAwesomeIcon icon={faPalette} />
            <span>RGB & Navigation</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="settings-tab-content">
          {/* 1. Profile Tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSubmit} encType="multipart/form-data">
              <div className="settings-section-card">
                <h3 className="settings-section-title">
                  <FontAwesomeIcon icon={faUser} style={{ color: "#ff007f" }} />
                  <span>Update Account Identity</span>
                </h3>

                {/* Default Preset Avatars (Male & Female) */}
                <AvatarPresetSelector
                  selectedUrl={avatar || avatarPreview}
                  onSelect={(presetUrl) => {
                    setAvatar(presetUrl);
                    setAvatarPreview(presetUrl);
                  }}
                />

                {/* Avatar Preview */}
                <div className="settings-avatar-wrap">
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="settings-avatar-img"
                    onError={(e) => {
                      e.target.src = "/images/avatars/avatar-male-chef.svg";
                    }}
                  />
                  <div>
                    <label htmlFor="customFile" className="settings-file-label">
                      <FontAwesomeIcon icon={faUpload} className="mr-2" />
                      Or Upload Custom Picture
                    </label>
                    <input
                      type="file"
                      name="avatar"
                      id="customFile"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleAvatarChange}
                    />
                    <small className="d-block text-muted mt-2">
                      JPG, PNG, WEBP recommended (Max 5MB)
                    </small>
                  </div>
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">Full Name</label>
                  <input
                    type="text"
                    className="settings-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">Email Address</label>
                  <input
                    type="email"
                    className="settings-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-save-settings mt-2"
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  {loading ? "Updating Vault..." : "Save Profile Changes"}
                </button>
              </div>
            </form>
          )}

          {/* 2. AI Taste Matrix Tab */}
          {activeTab === "ai" && (
            <div className="settings-section-card">
              <h3 className="settings-section-title">
                <FontAwesomeIcon icon={faSlidersH} style={{ color: "#00f2fe" }} />
                <span>AI Culinary Intelligence Tuning</span>
              </h3>

              <div className="settings-toggle-row">
                <div>
                  <div className="toggle-title">Pure Vegetarian Filter by Default</div>
                  <p className="toggle-desc">
                    Chef Lumina and Live Feed will prioritize purely vegetarian culinary offerings.
                  </p>
                </div>
                <label className="switch-slider-wrap">
                  <input
                    type="checkbox"
                    checked={pureVegOnly}
                    onChange={(e) => setPureVegOnly(e.target.checked)}
                  />
                  <span className="slider-switch" />
                </label>
              </div>

              <div className="settings-toggle-row">
                <div>
                  <div className="toggle-title">Real-Time Smart Food Pairings</div>
                  <p className="toggle-desc">
                    Auto-recommend ideal beverages and artisanal side dishes for selected food items.
                  </p>
                </div>
                <label className="switch-slider-wrap">
                  <input
                    type="checkbox"
                    checked={aiPairingsEnabled}
                    onChange={(e) => setAiPairingsEnabled(e.target.checked)}
                  />
                  <span className="slider-switch" />
                </label>
              </div>

              <div className="settings-form-group mt-3">
                <label className="settings-label">Spice Tolerance Calibration</label>
                <select
                  className="settings-input"
                  value={spiceLevel}
                  onChange={(e) => setSpiceLevel(e.target.value)}
                >
                  <option value="mild">🌱 Mild & Gentle (Delicate Flavors)</option>
                  <option value="medium">⚡ Medium (Classic Gourmet Balance)</option>
                  <option value="high">🔥 Hot & Fiery (Bold Chillies & Pepper)</option>
                </select>
              </div>

              <button
                type="button"
                className="btn-save-settings mt-3"
                onClick={handleTastePreferencesSave}
              >
                <FontAwesomeIcon icon={faCheck} className="mr-2" />
                Save AI Taste Preferences
              </button>
            </div>
          )}

          {/* 3. Security & Token Tab */}
          {activeTab === "security" && (
            <div className="settings-section-card">
              <h3 className="settings-section-title">
                <FontAwesomeIcon icon={faShieldAlt} style={{ color: "#a855f7" }} />
                <span>Authentication & Session Security</span>
              </h3>

              <div className="settings-toggle-row">
                <div>
                  <div className="toggle-title">JWT Session Expiration Lifespan</div>
                  <p className="toggle-desc">
                    Secure JWT token active duration updated from 90 days to 7 days for strict security compliance.
                  </p>
                </div>
                <span className="badge bg-secondary text-info p-2 px-3 rounded-pill">
                  7 DAYS ACTIVE
                </span>
              </div>

              <div className="settings-toggle-row">
                <div>
                  <div className="toggle-title">Cold Storage Keep-Alive Guard</div>
                  <p className="toggle-desc">
                    Continuous client-side background heartbeat keeps the live cloud backend warm.
                  </p>
                </div>
                <span className="badge bg-secondary text-success p-2 px-3 rounded-pill">
                  ACTIVE & RUNNING
                </span>
              </div>

              <div className="settings-toggle-row">
                <div>
                  <div className="toggle-title">Password & Credential Encryption</div>
                  <p className="toggle-desc">
                    Bcrypt salted one-way hash algorithm with zero plaintext credential exposure.
                  </p>
                </div>
                <span className="badge bg-secondary text-light p-2 px-3 rounded-pill">
                  BCRYPT ENCRYPTED
                </span>
              </div>
            </div>
          )}

          {/* 4. RGB & Navigation Tab */}
          {activeTab === "theme" && (
            <div className="settings-section-card">
              <h3 className="settings-section-title">
                <FontAwesomeIcon icon={faPalette} style={{ color: "#ff9900" }} />
                <span>Theme Aesthetics & Fluid Navigation</span>
              </h3>

              <div className="settings-toggle-row">
                <div>
                  <div className="toggle-title">3D Dynamic RGB Mesh Background</div>
                  <p className="toggle-desc">
                    Multi-layered radial glow with chromatic cyan, magenta, and violet perspective grid.
                  </p>
                </div>
                <span className="badge bg-secondary text-warning p-2 px-3 rounded-pill">
                  ENABLED
                </span>
              </div>

              <div className="settings-toggle-row">
                <div>
                  <div className="toggle-title">Ultra-Smooth Navigation & Page Transitions</div>
                  <p className="toggle-desc">
                    Silky CSS cubic-bezier smooth scrolling and seamless route fade-in transitions.
                  </p>
                </div>
                <label className="switch-slider-wrap">
                  <input
                    type="checkbox"
                    checked={smoothNav}
                    onChange={(e) => setSmoothNav(e.target.checked)}
                  />
                  <span className="slider-switch" />
                </label>
              </div>

              <div className="settings-toggle-row">
                <div>
                  <div className="toggle-title">350px Mobile-First Fluid Clamp</div>
                  <p className="toggle-desc">
                    Adaptive UI dynamically scales coverflow sliders and feed layouts for small phones.
                  </p>
                </div>
                <span className="badge bg-secondary text-info p-2 px-3 rounded-pill">
                  SUPPORTED (350PX+)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
