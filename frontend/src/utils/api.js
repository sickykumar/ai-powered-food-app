// Centralized API setup with auto-recovery for stale/invalid JWT tokens

import axios from "axios";
import qs from "qs";

const LIVE_BACKEND_URL = "https://api-food.sickykumar.in";

const api = axios.create({
  baseURL: ((import.meta.env.VITE_API_URL || LIVE_BACKEND_URL).replace(/\/$/, "")) + "/api",
  withCredentials: true,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auto-recovery interceptor: if JWT is expired or invalid due to secret change, clear stale token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.response?.data?.errMessage || "";

    if (
      error.response?.status === 401 ||
      message.toLowerCase().includes("json web token is invalid") ||
      message.toLowerCase().includes("jwt expired") ||
      message.toLowerCase().includes("jwt malformed") ||
      message.toLowerCase().includes("invalid token")
    ) {
      console.warn("Stale or invalid JWT token detected. Clearing local session.");
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

export default api;
