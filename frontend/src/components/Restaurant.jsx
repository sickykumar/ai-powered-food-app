import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteRestaurant, analyzeReviews } from "../redux/actions/restaurantAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faClock, faLocationDot, faRobot, faLeaf } from "@fortawesome/free-solid-svg-icons";

const Restaurant = ({ restaurant }) => {
  const dispatch = useDispatch();
  const [showAI, setShowAI] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({});
  const cardRef = useRef(null);

  const { isAuthenticated, user } = useSelector((state) => state.user || {});

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`,
      transition: "transform 0.1s ease-out",
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)",
      transition: "transform 0.4s ease-out",
    });
  };

  const handleToggleAI = async () => {
    if (!showAI && !restaurant.reviewSentiment) {
      setLoadingAI(true);
      await dispatch(analyzeReviews(restaurant._id));
      setLoadingAI(false);
    }
    setShowAI(!showAI);
  };

  const handleDelete = () => {
    if (!window.confirm("Delete this restaurant?")) return;
    dispatch(deleteRestaurant(restaurant._id)).catch(() => {
      alert("Unable to delete");
    });
  };

  const deliveryMinutes = Math.floor(20 + (restaurant.name.length * 2) % 25);

  return (
    <div className="col-12 col-md-6 col-lg-4 my-3">
      <div
        className="card restaurant-card-3d"
        ref={cardRef}
        style={tiltStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Card Header & Image */}
        <div className="rest-img-wrapper">
          <Link to={`/eats/stores/${restaurant._id}/menus`}>
            <img
              className="restaurant-image-3d"
              src={
                restaurant.images?.[0]?.url ||
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80"
              }
              alt={restaurant.name}
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80";
              }}
            />
          </Link>

          {/* Floating Badges */}
          <div className="rest-badge-top-left">
            {restaurant.isVeg ? (
              <span className="rest-veg-chip">
                <FontAwesomeIcon icon={faLeaf} className="mr-1" /> Pure Veg
              </span>
            ) : (
              <span className="rest-multi-chip">Multi-Cuisine</span>
            )}
          </div>

          <div className="rest-badge-top-right">
            <span className="rest-time-chip">
              <FontAwesomeIcon icon={faClock} className="mr-1" /> {deliveryMinutes} mins
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="card-body rest-body-3d">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <Link to={`/eats/stores/${restaurant._id}/menus`} className="rest-title-link">
              <h4 className="rest-name-3d m-0">{restaurant.name}</h4>
            </Link>
            <div className="rest-rating-pill">
              <FontAwesomeIcon icon={faStar} className="mr-1 text-warning" />
              <span>{restaurant.ratings ? Number(restaurant.ratings).toFixed(1) : "4.5"}</span>
            </div>
          </div>

          <p className="rest-address-3d mb-3">
            <FontAwesomeIcon icon={faLocationDot} className="mr-2 text-muted" />
            {restaurant.address}
          </p>

          <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary-subtle">
            <span className="reviews-count-text">
              ({restaurant.numOfReviews || 0} reviews)
            </span>

            <div className="d-flex gap-2">
              <button
                className="ai-insights-btn"
                onClick={handleToggleAI}
                disabled={loadingAI}
              >
                <FontAwesomeIcon icon={faRobot} className="mr-1" />
                {loadingAI ? "Analyzing..." : showAI ? "Hide AI" : "AI Review"}
              </button>

              <Link
                to={`/eats/stores/${restaurant._id}/menus`}
                className="explore-menu-btn"
              >
                Menu →
              </Link>
            </div>
          </div>

          {/* Expandable AI Review Insights */}
          {showAI && (
            <div className="ai-insights-box-3d mt-3">
              {loadingAI ? (
                <div className="text-muted text-center py-2" style={{ fontSize: "0.88rem" }}>
                  ⏳ Generating AI Sentiment Analysis...
                </div>
              ) : restaurant.reviewSentiment ? (
                <>
                  <div className="ai-sentiment-badge mb-2">
                    AI Sentiment: <strong>{restaurant.reviewSentiment}</strong>
                  </div>

                  <ul className="ai-bullets-list">
                    {(restaurant.reviewSummaryBullets || []).map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>

                  <div className="mentions-tags d-flex flex-wrap gap-1 mt-2">
                    {(restaurant.reviewTopMentions || []).map((item, index) => (
                      <span key={index} className="mention-tag-3d">
                        #{item}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-muted text-center py-2" style={{ fontSize: "0.85rem" }}>
                  AI Summary currently unavailable for this kitchen.
                </div>
              )}
            </div>
          )}

          {/* Admin Delete Action */}
          {isAuthenticated && user && user.role === "admin" && (
            <button
              className="btn btn-outline-danger btn-sm mt-3 w-100"
              onClick={handleDelete}
            >
              Delete Restaurant
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurant;