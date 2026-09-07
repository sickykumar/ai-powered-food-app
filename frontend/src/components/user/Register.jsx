import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/actions/userActions";
import { clearErrors } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import AvatarPresetSelector from "./AvatarPresetSelector";
import "./Auth.css";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phoneNumber: "",
  });

  const { name, email, password, passwordConfirm, phoneNumber } = user;

  const [avatar, setAvatar] = useState("/images/avatars/avatar-male-chef.svg");
  const [avatarPreview, setAvatarPreview] = useState("/images/avatars/avatar-male-chef.svg");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Account created successfully! Welcome to OrderIt AI");
      navigate("/");
    }
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, isAuthenticated, error, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      toast.error("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      toast.warning("Password should be at least 6 characters long");
      return;
    }

    const userData = {
      name,
      email,
      password,
      passwordConfirm,
      phoneNumber,
      avatar: avatar === "" ? "/images/default_avatar.png" : avatar,
    };

    dispatch(register(userData));
  };

  const onChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      if (e.target.files && e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
      }
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-glow-backdrop" />

      <div className="auth-card-3d auth-card-register">
        {/* Header */}
        <div className="auth-header">
          <span className="auth-brand-pill">✦ Join Next-Gen Foodies</span>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">
            Unlock AI taste curation, instant order tracking, and exclusive gourmet deals.
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={submitHandler} encType="multipart/form-data">
          <div className="row g-3">
            {/* Full Name */}
            <div className="col-12 col-md-6">
              <div className="auth-input-group">
                <label className="auth-label">Full Name</label>
                <input
                  type="text"
                  className="auth-input form-control"
                  placeholder="e.g. Sicky Kumar"
                  name="name"
                  value={name}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="col-12 col-md-6">
              <div className="auth-input-group">
                <label className="auth-label">Email Address</label>
                <input
                  type="email"
                  className="auth-input form-control"
                  placeholder="name@example.com"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="col-12">
              <div className="auth-input-group">
                <label className="auth-label">Phone Number</label>
                <input
                  type="tel"
                  className="auth-input form-control"
                  placeholder="10-digit mobile number"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="col-12 col-md-6">
              <div className="auth-input-group">
                <label className="auth-label">Password</label>
                <input
                  type="password"
                  className="auth-input form-control"
                  placeholder="At least 6 characters"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="col-12 col-md-6">
              <div className="auth-input-group">
                <label className="auth-label">Confirm Password</label>
                <input
                  type="password"
                  className="auth-input form-control"
                  placeholder="Repeat your password"
                  name="passwordConfirm"
                  value={passwordConfirm}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            {/* Default Avatar Preset Selector (Male & Female) */}
            <div className="col-12">
              <AvatarPresetSelector
                selectedUrl={avatar}
                onSelect={(presetUrl) => {
                  setAvatar(presetUrl);
                  setAvatarPreview(presetUrl);
                }}
              />
            </div>

            {/* Custom Avatar Upload Option */}
            <div className="col-12">
              <div className="auth-input-group">
                <label className="auth-label">Or Upload Your Own Photo</label>
                <div className="avatar-upload-box">
                  <img
                    src={avatarPreview}
                    className="avatar-preview-img"
                    alt="Avatar Preview"
                    onError={(e) => {
                      e.target.src = "/images/avatars/avatar-male-chef.svg";
                    }}
                  />
                  <div>
                    <label htmlFor="avatar-file-upload" className="avatar-custom-btn mb-1">
                      📸 Choose From Device
                    </label>
                    <input
                      type="file"
                      id="avatar-file-upload"
                      name="avatar"
                      className="avatar-file-input"
                      accept="image/*"
                      onChange={onChange}
                    />
                    <small className="d-block text-muted" style={{ fontSize: "0.75rem" }}>
                      JPG, PNG or WEBP (Max 2MB)
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="auth-submit-btn mt-3"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account & Start Feasting →"}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-card-footer">
          Already have an account?
          <Link to="/users/login" className="auth-link">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
