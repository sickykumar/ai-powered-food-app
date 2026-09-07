import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";

import Loader from "../layout/Loader";
import { getOrderDetails, updateOrder } from "../../redux/actions/orderActions";
import { clearErrors } from "../../redux/slices/orderSlice";


const OrderDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  //  order state
  const { loading, error, order } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user || {});

  const [selectedStatus, setSelectedStatus] = useState(null);
  const status = selectedStatus ?? (order?.orderStatus || "Processing");

  const updateOrderHandler = () => {
    dispatch(updateOrder(id, { status })).then(() => {
      toast.success("Order status updated successfully");
    });
  };


  // fetch data
  useEffect(() => {
    dispatch(getOrderDetails(id));
    
  }, [dispatch, id]);

  // toast error
  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-right" });
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  // safe destructuring
  const {
    _id,
    deliveryInfo = {},
    orderItems = [],
    paymentInfo = {},
    user: orderUser = {},
    finalTotal,
    orderStatus,
    
  } = order || {};



  // delivery address
  const deliveryDetails = deliveryInfo
    ? `${deliveryInfo.address || ""}, ${deliveryInfo.city || ""}, ${
        deliveryInfo.postalCode || ""
      }, ${deliveryInfo.country || ""}`
    : "";

  // payment status
  const isPaid = paymentInfo?.status === "paid";

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="row d-flex justify-content-between orderdetails">
            <div className="col-12 col-lg-8 mt-1 order-details">
              <h1 className="my-5">Order # {_id}</h1>


              {/* Delivery Info */}
              <h4 className="mb-4">Delivery Info</h4>
              <p>
                <b>Name:</b> {orderUser?.name || "N/A"}
              </p>
              <p>
                <b>Phone:</b> {deliveryInfo?.phoneNo || "N/A"}
              </p>
              <p className="mb-4">
                <b>Address:</b> {deliveryDetails || "N/A"}
              </p>

              <p>
                <b>Amount:</b>{" "}
                <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" />
                {finalTotal || 0}
              </p>

              <hr />

              {/* Payment */}
              <h4 className="my-4">
                Payment :
                <span className={isPaid ? "greenColor" : "redColor"}>
                  <b>{isPaid ? " PAID" : " NOT PAID"}</b>
                </span>
              </h4>

              {/* Order Status */}
              <h4 className="my-4">
                Order Status :
                <span
                  className={
                    orderStatus?.includes("Delivered")
                      ? "greenColor"
                      : "redColor"
                  }
                >
                  <b>{orderStatus || "Pending"}</b>
                </span>
              </h4>

              {/* Order Items */}
              <h4 className="my-4">Order Items:</h4>
              <hr />

              <div className="cart-item my-1">
                {orderItems.length > 0 ? (
                  orderItems.map((item) => (
                    <div key={item._id} className="row my-5">
                      <div className="col-4 col-lg-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          height="45"
                          width="65"
                        />
                      </div>

                      <div className="col-5 col-lg-5">
                        <Link to="#">{item.name}</Link>
                      </div>

                      <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                        <p>
                          <FontAwesomeIcon
                            icon={faIndianRupeeSign}
                            size="xs"
                          />
                          {item.price}
                        </p>
                      </div>

                      <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                        <p>{item.quantity} Item(s)</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No items found</p>
                )}
              </div>

              <hr />
            </div>

            {user && user.role === "admin" && (
              <div className="col-12 col-lg-3 mt-5">
                <h4 className="my-4" style={{ fontWeight: "600" }}>Update Status</h4>

                <div className="form-group">
                  <select
                    className="form-control"
                    name="status"
                    value={status}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                <button
                  className="btn btn-primary btn-block py-2"
                  onClick={updateOrderHandler}
                  style={{ fontWeight: "500" }}
                >
                  Update Status
                </button>
              </div>
            )}
          </div>
        </Fragment>
      )}
    </>
  );
};

export default OrderDetails;