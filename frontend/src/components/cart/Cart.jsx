import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartItems,
  removeItemFromCart,
  updateCartQuantity,
} from "../../redux/actions/cartActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupee } from "@fortawesome/free-solid-svg-icons";
import { payment } from "../../redux/actions/orderActions";
import { toast } from "react-toastify"; 
import { clearErrors } from "../../redux/slices/orderSlice";
import api from "../../utils/api";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, restaurant } = useSelector((state) => state.cart);
  const { error: orderError } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user || {});

  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCouponWindow, setShowCouponWindow] = useState(false);
  const [couponInput, setCouponInput] = useState("");

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  useEffect(() => {
    const getCoupons = async () => {
      try {
        const { data } = await api.get("/v1/coupon");
        setAvailableCoupons(data.data || []);
      } catch (err) {
        console.error("Failed to load coupons", err);
      }
    };
    getCoupons();
  }, []);

  useEffect(() => {
    if (orderError) {
      toast.error(orderError);
      dispatch(clearErrors());
    }
  }, [orderError, dispatch]);

  const removeCartItemHandler = (id) => {
    dispatch(removeItemFromCart(id));
    toast.success("Item removed from cart"); 
  };

  const increaseQty = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (newQty > stock) {
      toast.error("Exceeded stock limit");
      return;
    }
    dispatch(updateCartQuantity(id, newQty));
  };

  const decreaseQty = (id, quantity) => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      dispatch(updateCartQuantity(id, newQty));
    } else {
      toast.error("Minimum quantity reached"); 
    }
  };

  const handleApplyCoupon = async (code) => {
    if (!code || code.trim() === "") {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      const subtotalPrice = cartItems.reduce(
        (acc, item) => acc + item.quantity * item.foodItem.price,
        0
      );

      const { data } = await api.post("/v1/coupon/validate", {
        couponCode: code.toUpperCase(),
        cartItemsTotalAmount: subtotalPrice,
      });

      const validatedCoupon = data.data;

      if (validatedCoupon.message) {
        // Condition not met (e.g. min amount not reached)
        toast.warning(validatedCoupon.message);
      } else {
        setAppliedCoupon(validatedCoupon);
        toast.success(`Coupon ${validatedCoupon.couponName} applied successfully!`);
        setShowCouponWindow(false);
        setCouponInput("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon code");
    }
  };

  const checkoutHandler = () => {
    if (!user) {
      toast.info("Please sign in to proceed with checkout");
      return navigate("/users/login");
    }
    dispatch(payment(cartItems, restaurant, appliedCoupon?.couponName));
  };

  const subtotalPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.foodItem.price,
    0
  );

  const discountAmount = appliedCoupon
    ? Math.min(
        (subtotalPrice * appliedCoupon.discount) / 100,
        appliedCoupon.maxDiscount || Infinity
      )
    : 0;

  const finalTotal = subtotalPrice - discountAmount;

  return (
    <>
      {cartItems.length === 0 ? (
        <h2 className="mt-5">Your Cart is empty</h2>
      ) : (
        <>
          <h2 className="mt-5">
            Your Cart: <b>{cartItems.length} items</b>
          </h2>
          <h3 className="mt-5">
            Restaurant: <b>{restaurant.name}</b>
          </h3>

          <div className="row d-flex justify-content-between cartt">
            <div className="col-12 col-lg-8">
              {cartItems.map((item) => (
                <div className="cart-item" key={item._id}>
                  <div className="row">
                    <div className="col-4 col-lg-3">
                      <img
                        src={item.foodItem.images[0].url}
                        alt="items"
                        height="90"
                        width="115"
                      />
                    </div>

                    <div className="col-5 col-lg-3">
                      {item.foodItem.name}
                    </div>

                    <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                      <p id="card_item_price">
                        <FontAwesomeIcon icon={faIndianRupee} size="xs" />
                        {item.foodItem.price}
                      </p>
                    </div>

                    <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                      <div className="stockCounter d-inline">
                        <span
                          className="btn btn-danger minus"
                          onClick={() =>
                            decreaseQty(item.foodItem._id, item.quantity)
                          }
                        >
                          -
                        </span>

                        <input
                          type="number"
                          className="form-control count d-inline"
                          value={item.quantity}
                          readOnly
                        />

                        <span
                          className="btn btn-primary plus"
                          onClick={() =>
                            increaseQty(
                              item.foodItem._id,
                              item.quantity,
                              item.foodItem.stock
                            )
                          }
                        >
                          +
                        </span>
                      </div>
                    </div>

                    <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                      <i
                        id="delete_cart_item"
                        className="fa fa-trash btn btn-danger"
                        onClick={() =>
                          removeCartItemHandler(item.foodItem._id)
                        }
                      ></i>
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
            </div>

            <div className="col-12 col-lg-3 my-4">
              <div id="order_summary">
                <h4>Order Summary</h4>
                <hr />

                <p>
                  Subtotal:
                  <span className="order-summary-values">
                    {cartItems.reduce(
                      (acc, item) => acc + Number(item.quantity),
                      0
                    )}
                    (Units)
                  </span>
                </p>

                {appliedCoupon && (
                  <p>
                    Discount ({appliedCoupon.couponName}):
                    <span className="order-summary-values text-success">
                      -<FontAwesomeIcon icon={faIndianRupee} size="xs" />
                      {discountAmount.toFixed(2)}
                    </span>
                  </p>
                )}

                <p>
                  Total:
                  <span className="order-summary-values">
                    <FontAwesomeIcon icon={faIndianRupee} size="xs" />
                    {finalTotal.toFixed(2)}
                  </span>
                </p>

                <hr />

                <button
                  className="coupon-button"
                  onClick={() => setShowCouponWindow(true)}
                >
                  {appliedCoupon ? `Coupon Applied: ${appliedCoupon.couponName}` : "Apply Coupon"}
                </button>

                {appliedCoupon && (
                  <button
                    className="btn btn-sm btn-outline-danger mt-2 btn-block"
                    onClick={() => setAppliedCoupon(null)}
                  >
                    Remove Coupon
                  </button>
                )}

                <button
                  id="checkout_btn"
                  className="btn btn-primary btn-block mt-3"
                  onClick={checkoutHandler}
                >
                  Check Out
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {showCouponWindow && (
        <>
          <div className="overlay" onClick={() => setShowCouponWindow(false)}></div>
          <div className="coupon-window">
            <div className="coupon-header">
              <h4 className="mb-0">Available Coupons</h4>
              <span className="close-icon" onClick={() => setShowCouponWindow(false)}>
                &times;
              </span>
            </div>
            <div className="coupon-content" style={{ overflowY: "auto", height: "calc(100% - 70px)" }}>
              <div className="coupon-input-group mb-3 d-flex">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <button
                  className="btn btn-primary ml-2"
                  onClick={() => handleApplyCoupon(couponInput)}
                >
                  Apply
                </button>
              </div>
              <hr />
              {availableCoupons.length === 0 ? (
                <p className="text-muted text-center mt-4">No coupons available right now.</p>
              ) : (
                availableCoupons.map((coupon) => (
                  <div
                    key={coupon._id}
                    className="coupon-item p-3 border mb-2 rounded"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleApplyCoupon(coupon.couponName)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <strong className="text-primary">{coupon.couponName}</strong>
                      <span className="badge badge-success">{coupon.discount}% OFF</span>
                    </div>
                    <p className="mb-1 mt-1 text-muted" style={{ fontSize: "14px" }}>{coupon.subTitle}</p>
                    <small className="text-secondary d-block">{coupon.details}</small>
                    <small className="text-secondary d-block">
                      Min Order: ₹{coupon.minAmount}
                      {coupon.maxDiscount ? ` | Max Discount: ₹${coupon.maxDiscount}` : ""}
                    </small>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;