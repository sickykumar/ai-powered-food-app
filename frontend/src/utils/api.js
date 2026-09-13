// Centralized API setup with auto-recovery for stale/invalid JWT tokens

import axios from "axios";
import qs from "qs";

const apiBase = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const api = axios.create({
  baseURL: `${apiBase}/api`,
  withCredentials: true,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
});

// Cold start wake state tracker
const listeners = new Set();
let pendingCount = 0;
let wakeTimer = null;
let isWaking = false;

const notifyListeners = (state) => {
  listeners.forEach((fn) => {
    try {
      fn(state);
    } catch (e) {
      console.error("API Wake listener error:", e);
    }
  });
};

export const subscribeServerWake = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// Attach JWT token from localStorage to every request & track wake status
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    pendingCount++;
    if (pendingCount === 1) {
      // If request takes > 2.5s, trigger waking state notification (cold start)
      if (wakeTimer) clearTimeout(wakeTimer);
      wakeTimer = setTimeout(() => {
        isWaking = true;
        notifyListeners({ isWaking: true, state: "waking" });
      }, 2500);
    }

    return config;
  },
  (error) => {
    pendingCount = Math.max(0, pendingCount - 1);
    if (pendingCount === 0 && wakeTimer) {
      clearTimeout(wakeTimer);
      wakeTimer = null;
    }
    return Promise.reject(error);
  }
);

// Auto-recovery interceptor: if JWT is expired or invalid due to secret change, clear stale token
api.interceptors.response.use(
  (response) => {
    pendingCount = Math.max(0, pendingCount - 1);
    if (pendingCount === 0) {
      if (wakeTimer) {
        clearTimeout(wakeTimer);
        wakeTimer = null;
      }
      if (isWaking) {
        isWaking = false;
        notifyListeners({ isWaking: false, state: "connected" });
      }
    }
    return response;
  },
  (error) => {
    pendingCount = Math.max(0, pendingCount - 1);
    if (pendingCount === 0) {
      if (wakeTimer) {
        clearTimeout(wakeTimer);
        wakeTimer = null;
      }
      if (isWaking) {
        isWaking = false;
        notifyListeners({ isWaking: false, state: "error" });
      }
    }

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
