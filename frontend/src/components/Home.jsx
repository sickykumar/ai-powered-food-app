import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  sortByRatings,
  sortByReviews,
  toggleVegOnly,
  setSearchQuery,
  clearSearchQuery,
} from "../redux/slices/restaurantSlice";
import {
  createRestaurant,
  getRestaurants,
} from "../redux/actions/restaurantAction";
import Restaurant from "./Restaurant";
import Loader from "./layout/Loader";
import Message from "./Message";
import CountRestaurant from "./CountRestaurant";
import Slider3D from "./slider3d/Slider3D";
import AiHubSection from "./ai/AiHubSection";
import FloatingCartWidget from "./cart/FloatingCartWidget";
import api from "../utils/api";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faClock,
  faBolt,
  faLeaf,
  faIndianRupeeSign,
} from "@fortawesome/free-solid-svg-icons";

// Fallback items in case network is disconnected
const TRENDING_FALLBACK = [
  {
    _id: "fb1",
    id: "fb1",
    name: "Royal Dum Biryani",
    category: "Biryani • Mughlai",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80",
    price: 299,
    calories: 540,
    ratings: "4.9",
    badge: "🔥 Chef Special",
    isVeg: false,
    restaurantName: "Zyka Dum Safar",
  },
  {
    _id: "fb2",
    id: "fb2",
    name: "Paneer Lababdar",
    category: "North Indian • Pure Veg",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80",
    price: 260,
    calories: 420,
    ratings: "4.8",
    badge: "🌱 100% Veg",
    isVeg: true,
    restaurantName: "Punjab Grill Hub",
  },
  {
    _id: "fb3",
    id: "fb3",
    name: "Gourmet Truffle Pizza",
    category: "Woodfired Italian",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
    price: 389,
    calories: 590,
    ratings: "4.9",
    badge: "✨ Imported Truffle",
    isVeg: true,
    restaurantName: "Bella Italia",
  },
  {
    _id: "fb4",
    id: "fb4",
    name: "Crispy Avocado Crunch Roll",
    category: "Japanese Fusion",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80",
    price: 320,
    calories: 310,
    ratings: "4.7",
    badge: "🥑 Superfood",
    isVeg: true,
    restaurantName: "Daily Sushi",
  },
];

const MOOD_TABS = [
  "🌱 Pure Veg Delights",
  "🔥 Biryani Specials",
  "🍣 Asian & Sushi",
  "🍗 Starters & Crispy",
  "🍰 Sweets & Desserts",
  "⭐ Top Rated Masterpieces",
];

const getCategoryIcon = (name) => {
  const n = (name || "").toLowerCase();
  if (n === "all") return "✨";
  if (n.includes("biryani")) return "🍲";
  if (n.includes("sushi")) return "🍣";
  if (n.includes("veg")) return "🌱";
  if (n.includes("pizza") || n.includes("bread")) return "🍕";
  if (n.includes("burger")) return "🍔";
  if (n.includes("starter") || n.includes("chaat")) return "🥟";
  if (n.includes("main") || n.includes("gravy")) return "🍛";
  if (n.includes("dessert") || n.includes("sweet")) return "🍰";
  if (n.includes("meal")) return "🍗";
  return "🍽️";
};

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { keyword } = useParams();

  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedMood, setSelectedMood] = useState("🌱 Pure Veg Delights");
  const [allDishes, setAllDishes] = useState([]);
  const [dynamicCategories, setDynamicCategories] = useState(["All"]);

  const {
    loading: restaurantsLoading,
    error: restaurantsError,
    restaurants,
    searchQuery,
    showVegOnly,
    creating,
    createError,
  } = useSelector((state) => state.restaurants);

  const { isAuthenticated, user } = useSelector((state) => state.user || {});

  // Fetch restaurants from Redux
  useEffect(() => {
    if (restaurantsError) {
      toast.error(restaurantsError);
      return;
    }
    dispatch(getRestaurants(keyword));
  }, [dispatch, restaurantsError, keyword]);

  // Dynamically load all menus and dishes from live backend
  useEffect(() => {
    let isMounted = true;
    const fetchDynamicFoodData = async () => {
      try {
        const res = await api.get("/v1/eats/menus");
        const menusData = res.data?.data || [];
        const dishes = [];
        const catSet = new Set(["All"]);

        menusData.forEach((menuDoc) => {
          const restName = menuDoc.restaurant?.name || "Gourmet Kitchen";
          const restId = menuDoc.restaurant?._id || menuDoc.restaurant;
          const restIsVeg = menuDoc.restaurant?.isVeg || false;

          (menuDoc.menu || []).forEach((catGroup) => {
            const catName = catGroup.category || "Chef Special";
            catSet.add(catName);

            (catGroup.items || []).forEach((item) => {
              if (item && item.name) {
                const isVegItem =
                  restIsVeg ||
                  item.name.toLowerCase().includes("veg") ||
                  item.name.toLowerCase().includes("paneer") ||
                  item.name.toLowerCase().includes("soba") ||
                  item.name.toLowerCase().includes("chaat") ||
                  catName.toLowerCase().includes("veg");

                dishes.push({
                  ...item,
                  id: item._id,
                  restaurantName: restName,
                  restaurantId: restId,
                  category: `${catName} • ${restName}`,
                  rawCategory: catName,
                  image:
                    item.images?.[0]?.url ||
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80",
                  badge:
                    item.ratings >= 4.8
                      ? "🔥 Chef Special"
                      : item.price > 400
                      ? "✨ Signature"
                      : isVegItem
                      ? "🌱 100% Veg"
                      : "⚡ Popular Pick",
                  isVeg: isVegItem,
                  calories: 420,
                  ratings: item.ratings ? Number(item.ratings).toFixed(1) : "4.8",
                });
              }
            });
          });
        });

        if (isMounted) {
          setAllDishes(dishes);
          setDynamicCategories(Array.from(catSet));
        }
      } catch (err) {
        console.error("Dynamic menu loading fallback:", err);
      }
    };

    fetchDynamicFoodData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSortByRatings = () => {
    dispatch(sortByRatings());
  };

  const handleSortByReviews = () => {
    dispatch(sortByReviews());
  };

  const handleToggleVegOnly = () => {
    dispatch(toggleVegOnly());
  };

  // Admin controls
  const [showCreate, setShowCreate] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    address: "",
    isVeg: false,
    location: { type: "Point", coordinates: [] },
    imageUrl: "",
  });
  const [coordsInput, setCoordsInput] = React.useState("");

  const handleOpenCreate = () => {
    setCoordsInput(newRestaurant.location.coordinates.join(","));
    setShowCreate(true);
  };

  const handleCloseCreate = () => {
    setShowCreate(false);
    setCoordsInput("");
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "isVeg") {
      setNewRestaurant({ ...newRestaurant, isVeg: checked });
    } else if (name === "coordinates") {
      setCoordsInput(value);
      const parts = value
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v !== "");
      const coords = parts.map((v) => parseFloat(v)).filter((n) => !isNaN(n));
      setNewRestaurant({
        ...newRestaurant,
        location: { ...newRestaurant.location, coordinates: coords },
      });
    } else if (name === "imageUrl") {
      setNewRestaurant({ ...newRestaurant, imageUrl: value });
    } else {
      setNewRestaurant({ ...newRestaurant, [name]: value });
    }
  };

  const submitCreate = async (e) => {
    e.preventDefault();
    const payload = {
      name: newRestaurant.name,
      address: newRestaurant.address,
      isVeg: newRestaurant.isVeg,
      location: newRestaurant.location,
      images: [
        {
          public_id: "default",
          url: newRestaurant.imageUrl,
        },
      ],
    };
    const result = await dispatch(createRestaurant(payload));
    if (createRestaurant.fulfilled.match(result)) {
      handleCloseCreate();
      setCoordsInput("");
      toast.success("Restaurant added successfully!");
    }
  };

  // Filter restaurants by category or live search query
  const filteredRestaurants = (restaurants || []).filter((r) => {
    if (showVegOnly && !r.isVeg) return false;

    // Live global search query filtering (URL NOT exposed)
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        (r.name && r.name.toLowerCase().includes(q)) ||
        (r.cuisine && r.cuisine.toLowerCase().includes(q)) ||
        (r.location && r.location.toLowerCase().includes(q)) ||
        (r.address && r.address.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    if (activeCategory === "All") return true;
    if (activeCategory === "Pure Veg") return r.isVeg;
    return (
      r.name.toLowerCase().includes(activeCategory.toLowerCase()) ||
      (r.address && r.address.toLowerCase().includes(activeCategory.toLowerCase()))
    );
  });

  return (
    <div className="home-page-container">
      {/* 1. HERO BANNER SECTION */}
      <section className="hero-nextgen my-4 text-center">
        <div className="hero-glow-backdrop" />
        <div className="hero-content position-relative">
          <span className="hero-badge">
            <FontAwesomeIcon icon={faBolt} className="mr-1 text-warning" />
            AI-POWERED GASTRONOMY
          </span>

          <h1 className="hero-heading mt-3">
            Savor the Future of <span className="gradient-text">Food Intelligence</span>
          </h1>

          <p className="hero-subtext mx-auto mt-2">
            Explore chef-crafted cuisines, real-time AI taste pairings, and instant gourmet
            delivery with automated server keep-alive and zero delay.
          </p>

          {/* Quick AI Search Prompt Pills - URL NOT exposed */}
          <div className="d-flex flex-wrap justify-content-center gap-2 mt-4 hero-prompt-pills">
            <span className="prompt-label text-muted d-none d-md-inline">Try asking:</span>
            {[
              "🔥 Spicy Biryani under ₹300",
              "🥗 High Protein Keto Bowl",
              "🌱 Authentic Pure Veg Paneer",
              "⚡ Under 25 Mins Delivery",
            ].map((prompt, pIdx) => (
              <button
                key={pIdx}
                className="hero-prompt-chip"
                onClick={() => {
                  const cleaned = prompt.replace(/[🔥🥗🌱⚡]/gu, "").trim();
                  const searchWord = cleaned.split(" ")[1] || cleaned;
                  dispatch(setSearchQuery(searchWord));
                  const target = document.getElementById("restaurants-grid-section");
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Live Platform Stats */}
          <div className="row g-3 justify-content-center mt-4 hero-stats-row">
            <div className="col-6 col-md-3">
              <div className="stat-card">
                <div className="stat-num">{restaurants?.length || 8}+</div>
                <div className="stat-label">Luxury Kitchens</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card">
                <div className="stat-num">{allDishes?.length || 85}+</div>
                <div className="stat-label">Curated Delicacies</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card">
                <div className="stat-num text-emerald">🟢 0s Delay</div>
                <div className="stat-label">Cold Storage Guard</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card">
                <div className="stat-num text-warning">99.8%</div>
                <div className="stat-label">AI Taste Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 3D HORIZONTAL SLIDER #1: DYNAMIC CHEF SPECIALS & TRENDING DISHES */}
      <Slider3D
        items={
          (allDishes.length > 0 ? allDishes : TRENDING_FALLBACK)
            .filter((d) => (showVegOnly ? d.isVeg : true))
            .slice(0, 10)
        }
        badge="DYNAMIC 3D PICKS"
        title="🌟 AI Chef Specials & Trending Dishes"
        subtitle="Swipe through algorithmically curated delicacies sourced live from landmark kitchens."
        autoPlay={true}
        autoPlayInterval={3500}
        renderItem={(dish) => (
          <div
            className="dish-slider-card"
            onClick={() => {
              if (dish.restaurantId) {
                navigate(`/eats/stores/${dish.restaurantId}/menus`);
              }
            }}
          >
            <div className="dish-slider-img-wrap">
              <img
                src={dish.image}
                alt={dish.name}
                className="dish-slider-img"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80";
                }}
              />
              <span className="dish-slider-badge">{dish.badge}</span>
              <span className="dish-slider-cal">{dish.calories} kcal</span>
            </div>
            <div className="dish-slider-info p-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <h5 className="dish-slider-name m-0" title={dish.name}>
                  {dish.name}
                </h5>
                <span className="dish-slider-rating">⭐ {dish.ratings}</span>
              </div>
              <small className="text-muted d-block text-truncate">
                {dish.restaurantName}
              </small>
              <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top border-secondary-subtle">
                <span className="dish-slider-price">
                  <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" />
                  {dish.price}
                </span>
                <span className="dish-slider-btn">Order →</span>
              </div>
            </div>
          </div>
        )}
      />

      {/* 3. DYNAMIC CATEGORY SELECTOR PILLS */}
      <section className="categories-section my-4">
        <div className="d-flex flex-wrap justify-content-center gap-2">
          {(dynamicCategories.length > 1
            ? dynamicCategories
            : ["All", "Biryani Varities", "Sushi Varities", "Starter", "Main Course", "Chaats", "Dessert"]
          ).map((cat, idx) => (
            <button
              key={idx}
              className={`category-pill-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              <span className="mr-1">{getCategoryIcon(cat)}</span>
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 4. SPLIT-SCREEN AI HUB: Auto-Scroll on Left + AI Chatbot on Right */}
      <AiHubSection dishes={allDishes} />

      {/* 5. 3D HORIZONTAL SLIDER #2: FEATURED LUXURY KITCHENS */}
      {restaurants && restaurants.length > 0 && (
        <Slider3D
          items={restaurants.slice(0, 8)}
          badge="TOP RATED PARTNERS"
          title="🏆 Elite Kitchens & Landmark Restaurants"
          subtitle="Top culinary brands delivering gourmet perfection to your doorstep."
          autoPlay={true}
          autoPlayInterval={4500}
          renderItem={(rest) => (
            <div
              className="restaurant-slider-card"
              onClick={() => navigate(`/eats/stores/${rest._id}/menus`)}
            >
              <div className="rest-slider-img-wrap">
                <img
                  src={
                    rest.images?.[0]?.url ||
                    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80"
                  }
                  alt={rest.name}
                  className="rest-slider-img"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80";
                  }}
                />
                <span className="rest-slider-tag">
                  {rest.isVeg ? "🌱 Pure Veg" : "🍽️ Multi-Cuisine"}
                </span>
              </div>
              <div className="rest-slider-info p-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <h5 className="rest-slider-name m-0" title={rest.name}>
                    {rest.name}
                  </h5>
                  <span className="rest-slider-star">
                    ⭐ {rest.ratings ? Number(rest.ratings).toFixed(1) : "4.8"}
                  </span>
                </div>
                <p className="rest-slider-addr text-muted">
                  {rest.address ? rest.address.slice(0, 34) + "..." : "Gourmet Hub"}
                </p>
                <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top border-secondary-subtle">
                  <small className="text-muted">
                    <FontAwesomeIcon icon={faClock} className="mr-1" /> 25-30 mins
                  </small>
                  <span className="rest-slider-link">View Menu →</span>
                </div>
              </div>
            </div>
          )}
        />
      )}

      {/* 6. 3D HORIZONTAL SLIDER #3: DYNAMIC MOOD & DIETARY CURATIONS */}
      <section className="mood-curations-container my-5">
        <div className="text-center mb-4">
          <span className="slider3d-badge">LIFESTYLE CURATIONS</span>
          <h2 className="slider3d-title mt-2">🎯 What's Your Craving Mood Today?</h2>
          <p className="slider3d-subtitle">
            Tailored gastronomical experiences mapped dynamically from live kitchen menus.
          </p>

          {/* Dynamic Mood Tabs */}
          <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
            {MOOD_TABS.map((mood, mIdx) => (
              <button
                key={mIdx}
                className={`mood-tab-btn ${selectedMood === mood ? "active" : ""}`}
                onClick={() => setSelectedMood(mood)}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Slider for Selected Mood */}
        <Slider3D
          items={(() => {
            const pool = allDishes.length > 0 ? allDishes : TRENDING_FALLBACK;
            const filtered = pool.filter((dish) => {
              const name = (dish.name || "").toLowerCase();
              const cat = (dish.rawCategory || dish.category || "").toLowerCase();

              if (selectedMood.includes("Veg")) return dish.isVeg;
              if (selectedMood.includes("Biryani"))
                return name.includes("biryani") || cat.includes("biryani");
              if (selectedMood.includes("Asian"))
                return (
                  name.includes("sushi") ||
                  cat.includes("sushi") ||
                  name.includes("maki") ||
                  name.includes("roll")
                );
              if (selectedMood.includes("Starters"))
                return (
                  cat.includes("starter") ||
                  cat.includes("chaat") ||
                  cat.includes("meal") ||
                  name.includes("crispy") ||
                  name.includes("tikka")
                );
              if (selectedMood.includes("Sweets"))
                return (
                  cat.includes("dessert") ||
                  name.includes("cake") ||
                  name.includes("sweet") ||
                  name.includes("shake") ||
                  name.includes("fudge")
                );
              if (selectedMood.includes("Top Rated"))
                return Number(dish.ratings) >= 4.5;
              return true;
            });
            return filtered.length >= 3 ? filtered : pool.slice(0, 8);
          })()}
          badge="CURATED MOOD"
          title=""
          subtitle=""
          renderItem={(item) => (
            <div
              className="dish-slider-card"
              onClick={() => {
                if (item.restaurantId) {
                  navigate(`/eats/stores/${item.restaurantId}/menus`);
                }
              }}
            >
              <div className="dish-slider-img-wrap">
                <img
                  src={item.image}
                  alt={item.name}
                  className="dish-slider-img"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80";
                  }}
                />
                <span className="dish-slider-badge">{item.badge}</span>
                <span className="dish-slider-cal">{item.calories} kcal</span>
              </div>
              <div className="dish-slider-info p-3">
                <h5 className="dish-slider-name m-0" title={item.name}>
                  {item.name}
                </h5>
                <small className="text-muted d-block text-truncate mt-1">
                  {item.restaurantName}
                </small>
                <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top border-secondary-subtle">
                  <span className="dish-slider-price">
                    <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" />
                    {item.price}
                  </span>
                  <span className="dish-slider-btn">Order Now →</span>
                </div>
              </div>
            </div>
          )}
        />
      </section>

      {/* 7. ALL RESTAURANTS SHOWCASE & SMART FILTERS */}
      <section className="all-restaurants-section my-5" id="restaurants-grid-section">
        {/* Active Search Query Feedback Bar (URL NOT exposed) */}
        {searchQuery && (
          <div className="active-search-filter-banner mb-4 p-3 rounded-4 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <span className="search-filter-icon">🔍</span>
              <div>
                <span className="text-white-50 small d-block">Live Filter Active:</span>
                <span className="text-white fw-bold">
                  "{searchQuery}" — <span style={{ color: "#00f2fe" }}>{filteredRestaurants.length} matching kitchens found</span>
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-sm clear-search-pill-btn"
              onClick={() => dispatch(clearSearchQuery())}
            >
              ✕ Clear Filter
            </button>
          </div>
        )}

        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <CountRestaurant />
            <h3 className="section-main-heading mt-1">Explore Nearby Kitchens</h3>
          </div>

          {/* Sort Controls */}
          <div className="sort-bar d-flex flex-wrap gap-2 mt-3 mt-md-0">
            <button
              className={`sort-pill ${showVegOnly ? "active-sort" : ""}`}
              onClick={handleToggleVegOnly}
            >
              <FontAwesomeIcon icon={faLeaf} className="mr-1" />
              {showVegOnly ? "Show All Items" : "Pure Veg Only"}
            </button>

            <button className="sort-pill" onClick={handleSortByReviews}>
              Top Reviews
            </button>

            <button className="sort-pill" onClick={handleSortByRatings}>
              <FontAwesomeIcon icon={faStar} className="mr-1 text-warning" />
              Highest Rated
            </button>
          </div>
        </div>

        {restaurantsLoading ? (
          <Loader />
        ) : restaurantsError ? (
          <Message variant="danger">{restaurantsError}</Message>
        ) : (
          <div className="row">
            {filteredRestaurants && filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((restaurant) => (
                <Restaurant key={restaurant._id} restaurant={restaurant} />
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <Message variant="info">
                  No restaurants matching your current filter. Try resetting filters or searching another dish.
                </Message>
              </div>
            )}

            {/* Admin Add Restaurant Card */}
            {isAuthenticated && user && user.role === "admin" && (
              <div className="col-sm-12 col-md-6 col-lg-4 my-3">
                <div
                  className="card add-restaurant-card text-center d-flex align-items-center justify-content-center p-4"
                  onClick={handleOpenCreate}
                >
                  <div className="add-plus-circle mb-2">+</div>
                  <h5 className="m-0 text-white">Add New Restaurant</h5>
                  <small className="text-muted">Admin Manager Access</small>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Admin Create Modal */}
      {showCreate && (
        <div className="create-modal">
          <div className="create-content">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="m-0 text-white">Create Restaurant</h3>
              <button className="btn text-white" onClick={handleCloseCreate}>
                ✕
              </button>
            </div>

            <form onSubmit={submitCreate}>
              {createError && <Message variant="danger">{createError}</Message>}

              <div className="form-group mb-3">
                <label className="text-light">Restaurant Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={newRestaurant.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label className="text-light">Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={newRestaurant.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isVegCheck"
                  name="isVeg"
                  checked={newRestaurant.isVeg}
                  onChange={handleChange}
                />
                <label className="form-check-label text-light" htmlFor="isVegCheck">
                  Pure Veg Kitchen
                </label>
              </div>

              <div className="form-group mb-3">
                <label className="text-light">Coordinates (lat,lng)</label>
                <input
                  type="text"
                  className="form-control"
                  name="coordinates"
                  value={coordsInput}
                  onChange={handleChange}
                  placeholder="e.g. 28.6139, 77.2090"
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label className="text-light">Image URL</label>
                <input
                  type="text"
                  className="form-control"
                  name="imageUrl"
                  value={newRestaurant.imageUrl}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary flex-grow-1"
                  type="submit"
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create Restaurant"}
                </button>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={handleCloseCreate}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Quick Cart Widget */}
      <FloatingCartWidget />
    </div>
  );
};

export default Home;
