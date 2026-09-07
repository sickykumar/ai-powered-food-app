import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ROUTE_SEO = {
  "/": {
    title: "OrderIt | AI-Powered Gourmet Food Delivery & Smart Culinary Hub",
    description:
      "Order gourmet food delivered hot & fresh. Powered by AI Culinary Intelligence for personalized taste curation, interactive 3D menus, and ultrafast delivery.",
  },
  "/eats/stores": {
    title: "Top Rated Restaurants & Menus | OrderIt Gourmet Dining",
    description:
      "Explore handpicked gourmet restaurants, chef specials, biryanis, pizzas, and organic delicacies available for lightning-fast delivery.",
  },
  "/cart": {
    title: "Your Cart | OrderIt AI Gourmet Food Delivery",
    description:
      "Review your hand-selected gourmet delicacies, apply exclusive coupon codes, and proceed to secure checkout on OrderIt.",
  },
  "/users/login": {
    title: "Sign In to Your Account | OrderIt AI Food Delivery",
    description:
      "Log in to your OrderIt account to unlock personalized AI taste recommendations, track orders in real-time, and access exclusive culinary rewards.",
  },
  "/users/signup": {
    title: "Create Your Account | Join OrderIt Gourmet Experience",
    description:
      "Sign up for OrderIt to enjoy hyper-personalized food recommendations, VIP taste architect status, and express gourmet delivery.",
  },
  "/users/me": {
    title: "Holographic Taste Profile & Stats | OrderIt AI",
    description:
      "View your OrderIt profile, AI taste affinity matrix, gourmet badges, and personal delivery preferences.",
  },
  "/users/me/update": {
    title: "Update Your Profile | OrderIt Culinary Identity",
    description:
      "Customize your OrderIt profile, choose your personalized chef avatar preset, and update your gourmet delivery credentials.",
  },
  "/users/me/settings": {
    title: "Preferences & AI Taste Tuning | OrderIt Settings",
    description:
      "Configure your AI spice tolerance, dietary restrictions, notification preferences, and account security on OrderIt.",
  },
  "/eats/orders/me/myOrders": {
    title: "Your Orders & Live Tracking | OrderIt",
    description:
      "Track your active gourmet food orders in real-time and review your culinary dining history on OrderIt.",
  },
};

const MetaSEO = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    let config = ROUTE_SEO[pathname];

    // Check wildcard routes
    if (!config) {
      if (pathname.startsWith("/eats/stores/")) {
        config = {
          title: "Restaurant Menu & Chef Specials | OrderIt AI",
          description: "Browse the live menu, nutritional info, ratings, and order delicious dishes directly.",
        };
      } else if (pathname.startsWith("/order/")) {
        config = {
          title: "Order Details & Status | OrderIt",
          description: "View real-time preparation status and receipt details for your OrderIt meal.",
        };
      } else {
        config = {
          title: "OrderIt | AI-Powered Gourmet Food Delivery",
          description: "AI-powered gourmet food ordering and culinary intelligence platform.",
        };
      }
    }

    // 1. Update Title
    document.title = config.title;

    // 2. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", config.description);
    }

    // 3. Update Open Graph
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", config.title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", config.description);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", window.location.href);

    // 4. Update Twitter
    let twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute("content", config.title);

    let twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute("content", config.description);
  }, [location.pathname]);

  return null;
};

export default MetaSEO;
