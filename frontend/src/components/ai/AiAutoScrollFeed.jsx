import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AiHub.css";

const MOCK_AI_INSIGHTS = [
  {
    id: 1,
    dish: "Royal Hyderabadi Dum Biryani",
    category: "Biryani • Meghana's Biryani",
    tag: "🔥 99% Taste Match",
    calories: 520,
    protein: "28g Protein",
    pairing: "Pairs with Burani Garlic Raita & Chilled Mint Cooler",
    price: 280,
    rating: "4.9",
    isVeg: false,
    image: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/zuthvcwjjvdjmo6n1pbl",
    restaurantId: "66715b14c45b2f6c5ad027da",
  },
  {
    id: 2,
    dish: "Paneer Butter Masala Handi",
    category: "North Indian • Haldiram's",
    tag: "🌱 97% Veg Favorite",
    calories: 440,
    protein: "22g Plant Fuel",
    pairing: "Perfect with Truffle Butter Naan & Laccha Onion",
    price: 349,
    rating: "4.8",
    isVeg: true,
    image: "https://aartimadan.com/wp-content/uploads/2023/11/Paneer-Butter-Masala-Restaurant-Style.jpg",
    restaurantId: "667158dec45b2f6c5ad027d3",
  },
  {
    id: 3,
    dish: "Salmon Sushi & Maki Roll",
    category: "Japanese Gourmet • Daily Sushi",
    tag: "🍣 98% Omega-3 Boost",
    calories: 380,
    protein: "36g Lean Protein",
    pairing: "Served with Artisanal Wasabi & Pickled Ginger",
    price: 750,
    rating: "4.9",
    isVeg: false,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80",
    restaurantId: "667158dec45b2f6c5ad027d3",
  },
  {
    id: 4,
    dish: "Dahi Papdi Chaat Delight",
    category: "Artisanal Street • Haldiram's",
    tag: "⚡ 95% Tangy Crunch",
    calories: 290,
    protein: "9g Protein",
    pairing: "Comes with Sweet Tamarind & Green Chilly Chutney",
    price: 149,
    rating: "4.7",
    isVeg: true,
    image: "https://www.whiskaffair.com/wp-content/uploads/2021/03/Dahi-Papdi-Chaat-2-3.jpg",
    restaurantId: "667158dec45b2f6c5ad027d3",
  },
];

const AiAutoScrollFeed = ({ dishes = [] }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const baseItems =
    dishes && dishes.length > 0
      ? dishes.slice(0, 10).map((d, index) => ({
          id: d._id || index,
          dish: d.name,
          category: `${d.rawCategory || d.category || "Special"} • ${d.restaurantName || "Gourmet Kitchen"}`,
          tag: d.badge || (d.ratings >= 4.8 ? "🔥 99% Taste Match" : d.isVeg ? "🌱 Pure Veg Choice" : "✨ 96% AI Recommended"),
          calories: d.calories || 420,
          protein: d.isVeg ? "18g Plant Fuel" : "32g Protein",
          pairing: d.isVeg
            ? "Pairs with Herbal Mint Raita & Roasted Crisps"
            : "Best accompanied by Charcoal Smoked Dip & Lime Detox",
          price: d.price,
          rating: d.ratings ? Number(d.ratings).toFixed(1) : "4.8",
          isVeg: d.isVeg,
          image: d.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80",
          restaurantId: d.restaurantId,
        }))
      : MOCK_AI_INSIGHTS;

  const filteredItems = baseItems.filter((item) => {
    if (activeFilter === "veg") return item.isVeg;
    if (activeFilter === "protein") return !item.isVeg || item.protein?.includes("3") || item.calories > 400;
    if (activeFilter === "top") return Number(item.rating) >= 4.8;
    return true;
  });

  const displayList = filteredItems.length > 0 ? filteredItems : baseItems;
  // Duplicate list to create infinite seamless loop
  const loopItems = [...displayList, ...displayList];

  return (
    <div
      className="ai-feed-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header with Live Pulse */}
      <div className="ai-feed-header d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div className="d-flex align-items-center gap-2">
          <span className="live-pulse-radar">
            <span className="radar-ping" />
            <span className="radar-dot" />
          </span>
          <div>
            <h4 className="m-0 ai-feed-title">Live AI Food Intelligence</h4>
            <small className="text-muted" style={{ fontSize: "0.75rem" }}>
              Algorithmic Taste Matches & Nutrition Stream
            </small>
          </div>
        </div>
        <span className="ai-live-badge">
          <span className="live-dot-mini" /> LIVE STREAM
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="ai-feed-filter-bar d-flex gap-2 mb-3 pb-1">
        {[
          { id: "all", label: "✨ All Live" },
          { id: "veg", label: "🌱 Pure Veg" },
          { id: "protein", label: "💪 High Protein" },
          { id: "top", label: "⭐ 4.8+ Top Rated" },
        ].map((f) => (
          <button
            key={f.id}
            className={`ai-feed-filter-chip ${activeFilter === f.id ? "active" : ""}`}
            onClick={() => setActiveFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Auto-scrolling viewport */}
      <div className="ai-feed-viewport">
        <div className={`ai-feed-track ${isPaused ? "paused" : ""}`}>
          {loopItems.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="ai-feed-card">
              <div className="d-flex align-items-start gap-3">
                {/* Dish Thumbnail */}
                <div className="ai-feed-thumb-wrap flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.dish}
                    className="ai-feed-thumb"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80";
                    }}
                  />
                  <span className="ai-thumb-veg-icon">
                    {item.isVeg ? "🌱" : "🍗"}
                  </span>
                </div>

                {/* Info Column */}
                <div className="flex-grow-1 min-w-0">
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-1 mb-1">
                    <span className="ai-match-badge">{item.tag}</span>
                    <span className="ai-feed-rating">⭐ {item.rating}</span>
                  </div>

                  <h5 className="ai-card-dish text-truncate" title={item.dish}>
                    {item.dish}
                  </h5>
                  <p className="ai-card-cat text-truncate">{item.category}</p>

                  <div className="ai-macros-row d-flex flex-wrap gap-2 my-2">
                    <span className="macro-pill">⚡ {item.calories} kcal</span>
                    <span className="macro-pill protein-pill">💪 {item.protein}</span>
                    <span className="macro-pill price-pill">₹{item.price}</span>
                  </div>
                </div>
              </div>

              {/* Smart Sommelier Pairing */}
              <div className="ai-pairing-box d-flex align-items-center justify-content-between mt-2 pt-2 border-top border-secondary-subtle">
                <small className="ai-pairing-text">
                  💡 <strong>Chef Pairing:</strong> {item.pairing}
                </small>
                {item.restaurantId && (
                  <Link
                    to={`/eats/stores/${item.restaurantId}/menus`}
                    className="ai-feed-order-link flex-shrink-0 ml-2"
                  >
                    Order →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiAutoScrollFeed;
