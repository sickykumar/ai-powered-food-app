import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/actions/userActions";
import { toast } from "react-toastify";
import Search from "./Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingBag,
  faUser,
  faSignOutAlt,
  faClipboardList,
  faCog,
} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { user, loading } = useSelector((state) => state.user || {});
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });

  useEffect(() => {
    // Close dropdown on outside click
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logoutHandler = () => {
    dispatch(logout());
    setDropdownOpen(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="main-header sticky-top">
      <div className="header-container d-flex align-items-center justify-content-between flex-wrap">
        {/* Clean Brand Logo */}
        <div className="header-brand-box d-flex align-items-center">
          <Link to="/" className="brand-logo-link">
            <img
              src="/images/logo.webp"
              alt="OrderIt AI"
              className="navbar-logo-img"
            />
          </Link>
        </div>

        {/* Global Search Bar */}
        <div className="header-search-wrapper">
          <Search />
        </div>

        {/* Right Actions: Cart & User Profile */}
        <div className="header-actions-box d-flex align-items-center gap-2 gap-sm-3">
          {/* Cart Icon Button */}
          <Link to="/cart" className="header-cart-btn" title="View Cart">
            <div className="position-relative">
              <FontAwesomeIcon icon={faShoppingBag} />
              <span className="cart-item-count">
                {cartItems ? cartItems.length : 0}
              </span>
            </div>
            <span className="cart-text d-none d-sm-inline">Cart</span>
          </Link>

          {/* User Auth or Profile Dropdown */}
          {user ? (
            <div className="user-profile-menu position-relative" ref={dropdownRef}>
              <button
                className="user-profile-trigger d-flex align-items-center gap-2"
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-expanded={dropdownOpen}
              >
                <img
                  src={user?.avatar?.url || "/images/default_avatar.png"}
                  alt={user?.name || "User"}
                  className="user-avatar-img rounded-circle"
                  onError={(e) => {
                    e.target.src = "/images/default_avatar.png";
                  }}
                />
                <span className="user-name-label d-none d-md-inline">
                  {user?.name?.split(" ")[0]}
                </span>
                <span className="dropdown-caret">▾</span>
              </button>

              {dropdownOpen && (
                <div className="custom-dropdown-menu">
                  <div className="dropdown-user-header">
                    <strong>{user?.name}</strong>
                    <small className="d-block text-muted">{user?.email}</small>
                  </div>
                  <hr className="dropdown-divider my-2" />

                  <Link
                    to="/eats/orders/me/myOrders"
                    className="custom-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                    My Orders
                  </Link>

                  <Link
                    to="/users/me"
                    className="custom-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Profile
                  </Link>

                  <Link
                    to="/users/me/settings"
                    className="custom-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FontAwesomeIcon icon={faCog} className="mr-2" />
                    Settings
                  </Link>

                  <hr className="dropdown-divider my-2" />

                  <button
                    className="custom-dropdown-item text-danger border-0 bg-transparent w-100 text-left"
                    onClick={logoutHandler}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            !loading && (
              <div className="header-auth-buttons d-flex align-items-center">
                <Link to="/users/login" className="header-login-btn" title="Sign In">
                  <FontAwesomeIcon icon={faUser} className="d-inline-block d-sm-none" />
                  <span className="d-none d-sm-inline">Sign In</span>
                </Link>
                <Link
                  to="/users/signup"
                  className="header-signup-btn d-none d-sm-inline-block"
                >
                  Join
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;