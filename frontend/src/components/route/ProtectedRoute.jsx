import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "../layout/Loader";

/**
 * ProtectedRoute Component
 * Prevents unauthenticated users from switching directly to protected URLs.
 * If user is not logged in, redirects them safely to /users/login.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, loading, user } = useSelector(
    (state) => state.user || {}
  );
  const location = useLocation();

  // If auth status is still loading from token verification, show loader
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <Loader />
      </div>
    );
  }

  // If not logged in, redirect to login page and preserve the intended destination
  if (!isAuthenticated) {
    return <Navigate to="/users/login" state={{ from: location }} replace />;
  }

  // If route is restricted to admins only
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
