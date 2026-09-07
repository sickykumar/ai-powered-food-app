import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery, clearSearchQuery } from "../../redux/slices/restaurantSlice";
import api from "../../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faXmark,
  faUtensils,
  faStore,
  faStar,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import "./Search.css";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [matchingDishes, setMatchingDishes] = useState([]);
  const [allMenusCache, setAllMenusCache] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const searchContainerRef = useRef(null);

  const { restaurants } = useSelector((state) => state.restaurants || { restaurants: [] });

  // Preload menus once in the background for instant dish live search
  useEffect(() => {
    let isMounted = true;
    const loadMenusCache = async () => {
      try {
        const res = await api.get("/v1/eats/menus");
        const menusData = res.data?.data || [];
        const flatDishes = [];

        menusData.forEach((menuDoc) => {
          const restName = menuDoc.restaurant?.name || "Kitchen";
          const restId = menuDoc.restaurant?._id || menuDoc.restaurant;
          const restIsVeg = menuDoc.restaurant?.isVeg || false;

          (menuDoc.menu || []).forEach((catGroup) => {
            const catName = catGroup.category || "Special";
            (catGroup.items || []).forEach((item) => {
              if (item && item.name) {
                flatDishes.push({
                  id: item._id,
                  name: item.name,
                  price: item.price,
                  restaurantId: restId,
                  restaurantName: restName,
                  category: catName,
                  isVeg:
                    restIsVeg ||
                    item.name.toLowerCase().includes("veg") ||
                    item.name.toLowerCase().includes("paneer"),
                  image:
                    item.images?.[0]?.url ||
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&q=80",
                });
              }
            });
          });
        });

        if (isMounted) {
          setAllMenusCache(flatDishes);
        }
      } catch {
        // Silently tolerate if offline
      }
    };

    loadMenusCache();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle live search as user types
  useEffect(() => {
    const trimmed = keyword.trim().toLowerCase();
    if (!trimmed) {
      setMatchingDishes([]);
      dispatch(clearSearchQuery());
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      // 1. Dispatch global search query to Redux for live page filtering without URL alteration
      dispatch(setSearchQuery(trimmed));

      // 2. Filter matching dishes for the live autocomplete dropdown
      if (allMenusCache.length > 0) {
        const matched = allMenusCache
          .filter(
            (dish) =>
              dish.name.toLowerCase().includes(trimmed) ||
              dish.category.toLowerCase().includes(trimmed) ||
              dish.restaurantName.toLowerCase().includes(trimmed)
          )
          .slice(0, 5);
        setMatchingDishes(matched);
      }
      setIsSearching(false);
    }, 220);

    return () => clearTimeout(timeoutId);
  }, [keyword, allMenusCache, dispatch]);

  // Click outside to dismiss dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter matching restaurants for the live dropdown
  const trimmed = keyword.trim().toLowerCase();
  const matchingRestaurants = trimmed
    ? (restaurants || [])
        .filter(
          (r) =>
            r.name.toLowerCase().includes(trimmed) ||
            r.cuisine.toLowerCase().includes(trimmed) ||
            (r.address && r.address.toLowerCase().includes(trimmed))
        )
        .slice(0, 4)
    : [];

  const hasResults =
    matchingRestaurants.length > 0 || matchingDishes.length > 0;

  // Search submission (Search button or Enter key)
  const searchHandler = (e) => {
    if (e) e.preventDefault();
    setIsOpen(false);

    const q = keyword.trim();
    if (q) {
      dispatch(setSearchQuery(q));
      // If not on Home page, navigate to Home (clean URL, no query parameters!)
      if (location.pathname !== "/") {
        navigate("/");
      }

      // Smoothly scroll to the restaurant section on the home page
      setTimeout(() => {
        const target =
          document.getElementById("restaurants-grid-section") ||
          document.querySelector(".restaurant-section") ||
          document.querySelector(".home-page-container");
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    } else {
      dispatch(clearSearchQuery());
      if (location.pathname !== "/") {
        navigate("/");
      }
    }
  };

  const handleClear = () => {
    setKeyword("");
    dispatch(clearSearchQuery());
    setMatchingDishes([]);
    setIsOpen(false);
  };

  const handleSelectRestaurant = (restId) => {
    setIsOpen(false);
    navigate(`/eats/stores/${restId}/menus`);
  };

  const handleSelectDish = (dish) => {
    setIsOpen(false);
    navigate(`/eats/stores/${dish.restaurantId}/menus`);
  };

  return (
    <div className="header-search-container" ref={searchContainerRef}>
      <form onSubmit={searchHandler} className="search-input-wrapper">
        {/* Left Magnifier Icon */}
        <FontAwesomeIcon icon={faSearch} className="search-left-icon" />

        <input
          type="text"
          id="search_field"
          className="form-control search-field-input"
          placeholder="Live Search Kitchens, Cuisines, Biryani, Pizza..."
          value={keyword}
          autoComplete="off"
          onChange={(e) => {
            setKeyword(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (keyword.trim()) setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsOpen(false);
            }
          }}
        />

        {/* Action Controls Box */}
        <div className="search-actions-box">
          {keyword && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClear}
              title="Clear search"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}

          {/* Upgraded High-Tech Glowing Search Button */}
          <button
            type="submit"
            id="search_btn"
            className="search-submit-btn"
            title="Search dishes & restaurants"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </form>

      {/* Floating Holographic Live Dropdown Results */}
      {isOpen && keyword.trim().length >= 1 && (
        <div className="search-live-dropdown">
          {/* Matching Restaurants Group */}
          {matchingRestaurants.length > 0 && (
            <div className="dropdown-section mb-3">
              <div className="dropdown-group-title">
                <span>
                  <FontAwesomeIcon icon={faStore} className="mr-1" /> Kitchens & Restaurants
                </span>
                <span className="dropdown-group-badge">
                  {matchingRestaurants.length}
                </span>
              </div>
              {matchingRestaurants.map((rest) => (
                <div
                  key={rest._id}
                  className="search-result-item"
                  onClick={() => handleSelectRestaurant(rest._id)}
                >
                  <img
                    src={
                      rest.images?.[0]?.url ||
                      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&q=80"
                    }
                    alt={rest.name}
                    className="result-item-thumb"
                  />
                  <div className="result-item-info">
                    <div className="result-item-name">{rest.name}</div>
                    <div className="result-item-meta">
                      {rest.cuisine} • {rest.location || "Express Delivery"}
                    </div>
                  </div>
                  <div className="result-item-rating">
                    <FontAwesomeIcon icon={faStar} /> {rest.ratings || "4.8"}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Matching Dishes Group */}
          {matchingDishes.length > 0 && (
            <div className="dropdown-section mb-2">
              <div className="dropdown-group-title">
                <span>
                  <FontAwesomeIcon icon={faUtensils} className="mr-1" /> Dishes & Cuisines
                </span>
                <span className="dropdown-group-badge">
                  {matchingDishes.length}
                </span>
              </div>
              {matchingDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="search-result-item"
                  onClick={() => handleSelectDish(dish)}
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="result-item-thumb"
                  />
                  <div className="result-item-info">
                    <div className="result-item-name">
                      <span>{dish.name}</span>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          color: dish.isVeg ? "#00f2fe" : "#ff007f",
                        }}
                      >
                        {dish.isVeg ? "🌱 Veg" : "🍗 Non-Veg"}
                      </span>
                    </div>
                    <div className="result-item-meta">
                      at {dish.restaurantName}
                    </div>
                  </div>
                  <div className="result-item-price">₹{dish.price}</div>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {!hasResults && !isSearching && (
            <div className="search-dropdown-status">
              No matching kitchens or dishes for <span>"{keyword}"</span>.
              <br />
              <small className="text-muted">Press Enter to view all kitchens</small>
            </div>
          )}

          {/* Bottom Hint */}
          <div className="search-dropdown-footer">
            <span>
              Press <span className="search-footer-kbd">↵ Enter</span> to view on Home
            </span>
            <span>
              <span className="search-footer-kbd">Esc</span> to close
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
