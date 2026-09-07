const axios = require("axios");

/**
 * Cold Storage Keeper Service
 * Pings the server periodically (every 12 minutes) to prevent Render's
 * 15-minute inactivity spin-down (cold storage) from idling the server.
 */
let pingIntervalId = null;

const startColdStorageKeeper = () => {
  // Render provides RENDER_EXTERNAL_URL automatically in production
  const serverUrl =
    process.env.RENDER_EXTERNAL_URL ||
    process.env.BACKEND_URL ||
    (process.env.PORT ? `http://localhost:${process.env.PORT}` : null);

  if (!serverUrl) {
    console.log(
      "[ColdStorageKeeper] Notice: No RENDER_EXTERNAL_URL or BACKEND_URL configured; skipping external self-ping."
    );
    return;
  }

  // Try health/ping first, fallback to eats/stores if deployed version lacks health route
  const primaryPingUrl = `${serverUrl.replace(/\/$/, "")}/api/v1/health/ping`;
  const fallbackPingUrl = `${serverUrl.replace(/\/$/, "")}/api/v1/eats/stores`;
  const INTERVAL_MS = 12 * 60 * 1000; // 12 minutes (safely under the 15-min limit)

  console.log(`[ColdStorageKeeper] Active! Periodic keep-alive ping armed for: ${primaryPingUrl}`);

  const executePing = async () => {
    try {
      const res = await axios.get(primaryPingUrl, { timeout: 12000 });
      return res;
    } catch (err) {
      if (err.response?.status === 404) {
        // Ping fallback endpoint to keep server warm
        const fallbackRes = await axios.get(fallbackPingUrl, { timeout: 15000 });
        return fallbackRes;
      }
      throw err;
    }
  };

  // Initial ping with 30s delay after startup
  setTimeout(async () => {
    try {
      const res = await executePing();
      console.log(`[ColdStorageKeeper] Initial warmth ping confirmed: status ${res.status}`);
    } catch (err) {
      console.warn(`[ColdStorageKeeper] Initial ping notice: ${err.message}`);
    }
  }, 30000);

  // Interval ping
  pingIntervalId = setInterval(async () => {
    try {
      const res = await executePing();
      console.log(
        `[ColdStorageKeeper] Keep-alive ping successful at ${new Date().toLocaleTimeString()} (status ${res.status})`
      );
    } catch (err) {
      console.warn(`[ColdStorageKeeper] Keep-alive ping failed: ${err.message}`);
    }
  }, INTERVAL_MS);
};

const stopColdStorageKeeper = () => {
  if (pingIntervalId) {
    clearInterval(pingIntervalId);
    pingIntervalId = null;
  }
};

module.exports = {
  startColdStorageKeeper,
  stopColdStorageKeeper,
};
