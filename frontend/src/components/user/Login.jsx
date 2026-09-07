import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Loader from "../layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/actions/userActions";
import { clearErrors } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.user
  );

  // Redirect destination if user was redirected from protected route
  const redirectPath = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Welcome back! Logged in successfully");
      navigate(redirectPath, { replace: true });
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, isAuthenticated, error, navigate, redirectPath]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Please enter both email and password");
      return;
    }
    dispatch(login(email, password));
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-glow-backdrop" />

      {loading ? (
        <Loader />
      ) : (
        <div className="auth-card-3d">
          {/* Card Header */}
          <div className="auth-header">
            <span className="auth-brand-pill">✦ Culinary Access</span>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">
              Sign in to explore personalized AI feasts, real-time tracking, and gourmet benefits.
            </p>
          </div>

          {/* 1-Click Demo Quick-Fill */}
          <div className="demo-quickfill-box">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#10b981", letterSpacing: "1px", textTransform: "uppercase" }}>
                ⚡ Fast Demo Login
              </span>
              <span className="badge" style={{ fontSize: "0.68rem", backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#34d399", padding: "3px 8px", borderRadius: "8px" }}>
                1-Click Auto Fill
              </span>
            </div>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="demo-btn-user flex-grow-1"
                onClick={() => {
                  setEmail("test@user.com");
                  setPassword("test123");
                  toast.info("User demo credentials filled!");
                }}
              >
                👤 User Demo
              </button>
              <button
                type="button"
                className="demo-btn-admin flex-grow-1"
                onClick={() => {
                  setEmail("test@admin.com");
                  setPassword("test123");
                  toast.info("Admin demo credentials filled!");
                }}
              >
                🛠️ Admin Demo
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={submitHandler}>
            <div className="auth-input-group">
              <label className="auth-label">Email Address</label>
              <input
                type="email"
                className="auth-input form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="auth-label mb-0">Password</label>
                <button
                  type="button"
                  className="btn btn-link p-0 text-muted"
                  style={{ fontSize: "0.78rem", textDecoration: "none" }}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Sign In to Feast →"}
            </button>
          </form>

          {/* Card Footer */}
          <div className="auth-card-footer">
            Don't have an account yet?
            <Link to="/users/signup" className="auth-link">
              Create Account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
