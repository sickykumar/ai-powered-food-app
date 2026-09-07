import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, loadUser } from "../../redux/actions/userActions";
import { clearErrors, updateReset } from "../../redux/slices/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faUpload,
  faSave,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import AvatarPresetSelector from "./AvatarPresetSelector";
import "./Settings.css";
import "./Auth.css";

const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.png");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, error, isUpdated, loading } = useSelector(
    (state) => state.user
  );

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
        setTimeout(() => {
          navigate("/users/login");
        }, 2000);
      }
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Profile updated successfully!");
      dispatch(loadUser());
      navigate("/users/me");
      dispatch(updateReset());
    }
  }, [dispatch, error, navigate, isUpdated, user]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    if (avatar) {
      formData.set("avatar", avatar);
    }

    dispatch(updateProfile(formData));
  };

  const onChange = (e) => {
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

  return (
    <div className="settings-page-container">
      <div className="settings-ambient-glow" />

      <div className="settings-card-3d" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div className="mb-4">
          <Link to="/users/me" className="btn-profile-ghost mb-3 d-inline-flex">
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            <span>Back to Profile</span>
          </Link>
          <span className="settings-pill d-block mb-2">⚡ ACCOUNT VAULT</span>
          <h1 className="settings-title">Update Profile</h1>
          <p className="settings-subtitle">
            Keep your culinary persona, contact information, and avatar up to date.
          </p>
        </div>

        <form onSubmit={submitHandler} encType="multipart/form-data">
          {/* Default Preset Avatars (Male & Female) */}
          <AvatarPresetSelector
            selectedUrl={avatar || avatarPreview}
            onSelect={(presetUrl) => {
              setAvatar(presetUrl);
              setAvatarPreview(presetUrl);
            }}
          />

          <div className="settings-avatar-wrap">
            <img
              src={avatarPreview}
              className="settings-avatar-img"
              alt="Avatar Preview"
              onError={(e) => {
                e.target.src = "/images/avatars/avatar-male-chef.svg";
              }}
            />
            <div>
              <label htmlFor="avatar_file" className="settings-file-label">
                <FontAwesomeIcon icon={faUpload} className="mr-2" />
                Or Upload Custom Picture
              </label>
              <input
                type="file"
                name="avatar"
                id="avatar_file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={onChange}
              />
              <small className="d-block text-muted mt-2">
                JPG, PNG, or WEBP (Max 5MB)
              </small>
            </div>
          </div>

          <div className="settings-form-group">
            <label htmlFor="name_field" className="settings-label">
              <FontAwesomeIcon icon={faUser} className="mr-2 text-info" />
              Full Name
            </label>
            <input
              type="text"
              id="name_field"
              className="settings-input"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="settings-form-group">
            <label htmlFor="email_field" className="settings-label">
              <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-info" />
              Email Address
            </label>
            <input
              type="email"
              id="email_field"
              className="settings-input"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-save-settings w-100 mt-3"
            disabled={loading}
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            {loading ? "Updating Profile..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;