//Dispatch => Call API =>Update state based on success or failure

import api from "../../utils/api";
import {
  loginRequest,
  loginSuccess,
  loginFail,
  loadUserFail,
  logoutSuccess,
  logoutFail,
  updateRequest,
  updateSuccess,
  updateFail,
} from "../slices/userSlice";
import { fetchCartItems } from "./cartActions";
import { clearCart } from "../slices/cartSlice";

// LOGIN

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await api.post("/v1/users/login", {
      email,
      password,
    });
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    dispatch(loginSuccess(data.data.user));
    dispatch(fetchCartItems());
  } catch (error) {
    dispatch(loginFail(error.response?.data?.message || "login Failed "));
  }
};

//Register
export const register = (userData) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    const { data } = await api.post("/v1/users/signup", userData, {
      headers: { "Content-Type": "application/json" },
    });
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    dispatch(loginSuccess(data.data.user));
    dispatch(fetchCartItems());
  } catch (error) {
    dispatch(loginFail(error.response?.data?.message));
  }
};

//load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch(loginRequest());

    const { data } = await api.get("/v1/users/me");

    dispatch(loginSuccess(data.user));
    dispatch(fetchCartItems());
  } catch (error) {
    localStorage.removeItem("token");
    dispatch(loadUserFail(error.response?.data?.message));
  }
};

//update profile

export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch(updateRequest());

    const { data } = await api.put("/v1/users/me/update", userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(updateSuccess(data.success));
  } catch (error) {
    dispatch(updateFail(error.response?.data?.message));
  }
};

//logout
export const logout = () => async (dispatch) => {
  try {
    await api.get("/v1/users/logout");
    localStorage.removeItem("token");
    dispatch(logoutSuccess());
    dispatch(clearCart());
  } catch (error) {
    localStorage.removeItem("token");
    dispatch(logoutFail(error.response?.data?.message));
  }
};
