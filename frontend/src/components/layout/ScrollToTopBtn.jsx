import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import "./ScrollToTopBtn.css";

const ScrollToTopBtn = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  const hasCart = Boolean(cartItems && cartItems.length > 0);

  return (
    <button
      type="button"
      className={`scroll-to-top-btn ${hasCart ? "cart-offset" : ""}`}
      onClick={scrollToTop}
      title="Scroll to Top"
      aria-label="Scroll to top of page"
    >
      <FontAwesomeIcon icon={faArrowUp} />
    </button>
  );
};

export default ScrollToTopBtn;
