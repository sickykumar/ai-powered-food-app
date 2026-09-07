import React, { useState, useRef, useEffect } from "react";
import "./Slider3D.css";

/**
 * 3D Horizontal Slider Component
 * Provides smooth 3D coverflow perspective with card tilt, shadows,
 * controls (prev/next), and auto-play options.
 */
const Slider3D = ({
  items = [],
  renderItem,
  title = "",
  subtitle = "",
  badge = "3D SHOWCASE",
  autoPlay = false,
  autoPlayInterval = 4000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const total = items.length;

  const nextSlide = () => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  useEffect(() => {
    if (!autoPlay || isHovered || total <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, isHovered, total, autoPlayInterval]);

  if (!items || items.length === 0) return null;

  return (
    <div
      className="slider3d-wrapper my-5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Section Header */}
      <div className="slider3d-header d-flex flex-wrap justify-content-between align-items-end mb-4">
        <div>
          {badge && <span className="slider3d-badge">{badge}</span>}
          {title && <h2 className="slider3d-title mt-2">{title}</h2>}
          {subtitle && <p className="slider3d-subtitle">{subtitle}</p>}
        </div>

        {/* Navigation Arrows */}
        <div className="slider3d-controls d-flex align-items-center gap-2">
          <button
            className="slider3d-btn prev-btn"
            onClick={prevSlide}
            aria-label="Previous Slide"
          >
            &#10094;
          </button>
          <span className="slider3d-counter">
            {currentIndex + 1} <span className="text-muted">/ {total}</span>
          </span>
          <button
            className="slider3d-btn next-btn"
            onClick={nextSlide}
            aria-label="Next Slide"
          >
            &#10095;
          </button>
        </div>
      </div>

      {/* 3D Viewport Stage */}
      <div className="slider3d-stage" ref={containerRef}>
        <div className="slider3d-track">
          {items.map((item, index) => {
            // Calculate relative offset from currentIndex
            let offset = index - currentIndex;
            // Wrap around for seamless loop if needed
            if (offset > Math.floor(total / 2)) offset -= total;
            if (offset < -Math.floor(total / 2)) offset += total;

            const isCurrent = offset === 0;
            const isVisible = Math.abs(offset) <= 2;

            if (!isVisible) return null;

            // 3D Transform calculations adapted down to 350px screens
            const cardSpacing = windowWidth <= 380 ? 130 : windowWidth <= 480 ? 150 : 195;
            const translateX = offset * cardSpacing;
            const translateZ = isCurrent ? 25 : -Math.abs(offset) * (windowWidth <= 480 ? 45 : 75);
            const rotateY = offset * (windowWidth <= 480 ? -10 : -14); // 3D angle
            const scale = isCurrent ? 1.02 : Math.max(0.85, 1 - Math.abs(offset) * 0.1);
            const opacity = isCurrent ? 1 : Math.max(0.4, 1 - Math.abs(offset) * 0.35);
            const zIndex = 10 - Math.abs(offset);

            return (
              <div
                key={item._id || item.id || index}
                className={`slider3d-card-wrapper ${isCurrent ? "active-card" : ""}`}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                }}
                onClick={() => setCurrentIndex(index)}
              >
                {renderItem(item, isCurrent)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="slider3d-dots d-flex justify-content-center mt-4">
        {items.map((_, idx) => (
          <button
            key={idx}
            className={`slider3d-dot ${idx === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider3D;
