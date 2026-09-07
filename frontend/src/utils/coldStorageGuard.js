import api from "./api";

/**
 * Cold Storage Guard (Client-side Keep-Alive Engine)
 * Prevents Render free-tier cold starts (which happen after 15 min of inactivity)
 * by maintaining an active heartbeat while the user browses, and measuring real-time latency.
 */

class ColdStorageGuard {
  constructor() {
    this.status = "warming"; // warming | warm | offline
    this.latency = null;
    this.lastPing = null;
    this.listeners = new Set();
    this.intervalId = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // First ping immediately
    this.ping();

    // Periodic heartbeat every 10 minutes (safely under the 15m spin-down window)
    const HEARTBEAT_INTERVAL = 10 * 60 * 1000;
    this.intervalId = setInterval(() => {
      this.ping();
    }, HEARTBEAT_INTERVAL);

    // Also ping when tab gains focus if last ping was more than 5 minutes ago
    if (typeof window !== "undefined") {
      window.addEventListener("focus", () => {
        if (!this.lastPing || Date.now() - this.lastPing > 5 * 60 * 1000) {
          this.ping();
        }
      });
    }
  }

  async ping() {
    const startTime = performance.now();
    try {
      const response = await api.get("/v1/health/ping", { timeout: 12000 });
      const elapsed = Math.round(performance.now() - startTime);

      this.latency = elapsed;
      this.status = "warm";
      this.lastPing = Date.now();
      this.notify();
      return { success: true, latency: elapsed, data: response.data };
    } catch {
      // Fallback attempt to root health or public stores route
      try {
        const res2 = await api.get("/v1/eats/stores", { timeout: 15000 });
        const elapsed2 = Math.round(performance.now() - startTime);
        this.latency = elapsed2;
        this.status = "warm";
        this.lastPing = Date.now();
        this.notify();
        return { success: true, latency: elapsed2, data: res2.data };
      } catch (fallbackErr) {
        this.status = "offline";
        this.notify();
        return { success: false, error: fallbackErr.message };
      }
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    // Send immediate current state
    listener({
      status: this.status,
      latency: this.latency,
      lastPing: this.lastPing,
    });
    return () => this.listeners.delete(listener);
  }

  notify() {
    const state = {
      status: this.status,
      latency: this.latency,
      lastPing: this.lastPing,
    };
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (e) {
        console.error("ColdStorageGuard listener error:", e);
      }
    });
  }

  getState() {
    return {
      status: this.status,
      latency: this.latency,
      lastPing: this.lastPing,
    };
  }
}

const coldStorageGuard = new ColdStorageGuard();
export default coldStorageGuard;
