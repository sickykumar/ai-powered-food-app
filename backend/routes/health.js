const express = require("express");
const router = express.Router();

/**
 * Health & Cold Storage Protection Endpoint
 * Render and free cloud tiers spin down after 15 minutes of inactivity.
 * This endpoint responds immediately with system metrics and keeps the instance warm.
 */
router.get("/", (req, res) => {
  const uptimeSeconds = Math.floor(process.uptime());
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;

  const memoryUsage = process.memoryUsage();

  res.status(200).json({
    status: "success",
    state: "warm",
    coldStorageProtected: true,
    message: "Server is warm and active. Cold storage spin-down prevented.",
    timestamp: new Date().toISOString(),
    uptime: `${hours}h ${minutes}m ${seconds}s`,
    uptimeSeconds,
    memory: {
      rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
    },
    service: "AI-Powered-Food-App-API",
  });
});

router.get("/ping", (req, res) => {
  res.status(200).json({
    status: "pong",
    state: "warm",
    timestamp: Date.now(),
  });
});

module.exports = router;
