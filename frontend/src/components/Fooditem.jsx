import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign, faFire, faLeaf, faStar } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addItemToCart,
  updateCartQuantity,
  removeItemFromCart,
} from "../redux/actions/cartActions";
import api from "../utils/api";
import { getMenus } from "../redux/actions/menuActions";

const Fooditem = ({ fooditem, restaurant }) => {
  const [tiltStyle, setTiltStyle] = useState({});
  const cardRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State
  const { user } = useSelector((state) => state.user);
  const isAuthenticated = !!user;
  const { cartItems } = useSelector((state) => state.cart);

  // Derived cart state (pure & reactive)
  const cartItem = (cartItems || []).find(
    (item) => item.foodItem?._id === fooditem._id
  );
  const inCart = !!cartItem;
  const quantity = cartItem ? cartItem.quantity : 1;

  // 3D Interactive Mouse Tilt
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

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

  // Decrease quantity
  const decreaseQty = () => {
    if (quantity > 1) {
      dispatch(updateCartQuantity(fooditem._id, quantity - 1));
    } else {
      dispatch(removeItemFromCart(fooditem._id));
    }
  };

  // Increase quantity
  const increaseQty = () => {
    if (quantity < fooditem.stock) {
      dispatch(updateCartQuantity(fooditem._id, quantity + 1));
    } else {
      alert("Exceeded stock limit");
    }
  };

  // Add to cart
  const addToCartHandler = () => {
    if (!isAuthenticated) {
      return navigate("/users/login");
    }
    dispatch(addItemToCart(fooditem._id, restaurant, 1));
  };

  // Approximate calories & veg status
  const isPureVeg = fooditem.category?.toLowerCase().includes("veg") && !fooditem.category?.toLowerCase().includes("non");
  const estimatedCalories = fooditem.calories || Math.round(260 + (fooditem.price % 300));

  return (
    <div className="col-sm-12 col-md-6 col-lg-3 my-3">
      <div
        className="card food-card-3d rounded"
        ref={cardRef}
        style={tiltStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Top Badges */}
        <div className="food-badge-overlay d-flex justify-content-between">
          <span className={`badge-pill ${isPureVeg ? "veg-pill" : "nonveg-pill"}`}>
            <FontAwesomeIcon icon={faLeaf} className="mr-1" />
            {isPureVeg ? "Pure Veg" : "Gourmet"}
          </span>
          <span className="badge-pill calorie-pill">
            <FontAwesomeIcon icon={faFire} className="mr-1" />
            {estimatedCalories} kcal
          </span>
        </div>

        {/* 3D Floating Image with Depth */}
        <div className="food-img-container">
          <img
            className="card-img-top food-image-3d"
            src={fooditem.images?.[0]?.url || "/images/placeholder.png"}
            alt={fooditem.name}
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80";
            }}
          />
          <div className="food-price-tag">
            <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" />
            {fooditem.price}
          </div>
        </div>

        <div className="card-body d-flex flex-column justify-content-between p-3">
          <div>
            <h5 className="card-title food-title-3d">{fooditem.name}</h5>
            <p className="fooditem_des food-desc-3d">{fooditem.description}</p>
          </div>

          <div className="food-card-footer mt-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="stock-indicator">
                <span className={`stock-dot ${fooditem.stock > 0 ? "in-stock" : "out-stock"}`} />
                {fooditem.stock > 0 ? "Freshly Available" : "Sold Out"}
              </span>
              {fooditem.ratings > 0 && (
                <span className="rating-pill">
                  <FontAwesomeIcon icon={faStar} className="text-warning mr-1" />
                  {fooditem.ratings}
                </span>
              )}
            </div>

            {!inCart ? (
              (!isAuthenticated || user?.role !== "admin") && (
                <button
                  id="cart_btn"
                  className="btn btn-primary add-cart-btn-3d w-100"
                  disabled={fooditem.stock === 0}
                  onClick={addToCartHandler}
                >
                  {fooditem.stock === 0 ? "Sold Out" : "+ Add to Feast"}
                </button>
              )
            ) : (
              <div className="stockCounter d-flex align-items-center justify-content-center gap-2">
                <button className="qty-btn minus-btn" onClick={decreaseQty}>
                  -
                </button>
                <input
                  type="number"
                  className="form-control qty-display"
                  value={quantity}
                  readOnly
                />
                <button className="qty-btn plus-btn" onClick={increaseQty}>
                  +
                </button>
              </div>
            )}

            {/* Admin Delete Action */}
            {isAuthenticated && user?.role === "admin" && (
              <button
                className="btn btn-danger btn-sm mt-2 w-100"
                onClick={async () => {
                  if (!window.confirm("Delete this food item?")) return;
                  try {
                    await api.delete(`/v1/eats/item/${fooditem._id}`);
                    if (restaurant) {
                      dispatch(getMenus(restaurant));
                    }
                  } catch (err) {
                    console.error(err);
                    alert(err.response?.data?.message || "Unable to delete item");
                  }
                }}
              >
                Delete Item
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fooditem;