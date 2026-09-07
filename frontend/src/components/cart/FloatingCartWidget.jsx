import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag, faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import "./FloatingCart.css";

const FloatingCartWidget = () => {
  const location = useLocation();
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });

  // Hide on cart page itself
  if (location.pathname === "/cart" || !cartItems || cartItems.length === 0) {
    return null;
  }

  const totalItems = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.quantity || 1) * (item.foodItem?.price || 0),
    0
  );

  return (
    <div className="floating-cart-anchor">
      <Link to="/cart" className="floating-cart-btn">
        <div className="d-flex align-items-center gap-3">
          <div className="cart-icon-bubble">
            <FontAwesomeIcon icon={faShoppingBag} />
            <span className="cart-badge-count">{totalItems}</span>
          </div>
          <div className="cart-info-text text-start">
            <div className="cart-label-sub">Cart Subtotal</div>
            <div className="cart-total-amount">
              <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" />
              {totalPrice.toFixed(0)}
            </div>
          </div>
        </div>
        <div className="cart-action-pill">
          View Cart →
        </div>
      </Link>
    </div>
  );
};

export default FloatingCartWidget;
