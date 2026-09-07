const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const errorMiddleware = require("./middlewares/errors");

// Route imports
const aiRoutes = require("./routes/ai.routes");
const healthRoutes = require("./routes/health");
const foodRouter = require("./routes/foodItem");
const restaurant = require("./routes/restaurant");
const menuRouter = require("./routes/menu");
const coupon = require("./routes/couponRoutes");
const order = require("./routes/order");
const auth = require("./routes/auth");
const payment = require("./routes/payment");
const cart = require("./routes/cart");

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://ai-powered-food-app.vercel.app",
      ];

      const cleanOrigin = origin.replace(/\/$/, "");
      const isVercelDomain = cleanOrigin.endsWith(".vercel.app");
      const envOrigin = process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.replace(/['"]/g, "").replace(/\/$/, "")
        : null;

      const isAllowed =
        allowedOrigins.some((o) => o.replace(/\/$/, "") === cleanOrigin) ||
        isVercelDomain ||
        (envOrigin && envOrigin === cleanOrigin);

      if (isAllowed) {
        return callback(null, true);
      }

      console.log(`CORS dynamic origin fallback allowed: ${origin}`);
      return callback(null, true);
    },
    credentials: true,
  })
);

// Body and Cookie Parsers
app.use(express.json({ limit: "30kb" }));
app.use(express.urlencoded({ extended: true, limit: "30kb" }));
app.use(cookieParser());
app.use(fileUpload());

// Serve static images if needed
app.use("/public", express.static(path.join(__dirname, "public")));

// Template engine setup for transactional emails
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Health & Cold Storage Protection Endpoints
app.use("/api/v1/health", healthRoutes);
app.use("/health", healthRoutes);

// API v1 Routes
app.use("/api/v1/eats", foodRouter);
app.use("/api/v1/eats/menus", menuRouter);
app.use("/api/v1/eats/stores", restaurant);
app.use("/api/v1/eats/orders", order);
app.use("/api/v1/users", auth);
app.use("/api/v1", payment);
app.use("/api/v1/coupon", coupon);
app.use("/api/v1/eats/cart", cart);
app.use("/api/v1/ai", aiRoutes);

// Root route to check API status
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    state: "warm",
    message: "AI Food App API is online and operational.",
    coldStorageProtection: "active",
    docs: "/api/v1/health",
  });
});

// 404 Handler
app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
