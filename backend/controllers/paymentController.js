const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Coupon = require("../models/couponModel");

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const { items, restaurant, couponCode } = req.body;

  // Dynamically resolve the frontend origin from the incoming request
  const rawOrigin = req.headers.origin || process.env.FRONTEND_URL || "http://localhost:5173";
  const frontendOrigin = rawOrigin.replace(/['"]/g, "").replace(/\/$/, "");

  const sessionParams = {
    customer_email: req.user.email,
    phone_number_collection: {
      enabled: true,
    },
    line_items: items.map((item) => {
      const lineItem = {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.foodItem.name,
          },
          unit_amount: item.foodItem.price * 100,
        },
        quantity: item.quantity,
      };

      if (
        item.foodItem.images &&
        item.foodItem.images.length > 0 &&
        item.foodItem.images[0].url
      ) {
        const imageUrl = item.foodItem.images[0].url;
        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
          lineItem.price_data.product_data.images = [imageUrl];
        } else if (imageUrl.startsWith("/")) {
          const origin = req.headers.origin || process.env.FRONTEND_URL || "http://localhost:5173";
          lineItem.price_data.product_data.images = [`${origin.replace(/\/$/, "")}${imageUrl}`];
        }
      }

      return lineItem;
    }),
    mode: "payment",
    shipping_address_collection: {
      allowed_countries: ["US", "IN"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery Charges",
          type: "fixed_amount",
          fixed_amount: {
            amount: 5500, // Amount in paise (e.g., 5500 = 55 INR)
            currency: "inr",
          },
          delivery_estimate: {
            minimum: {
              unit: "hour",
              value: 1,
            },
            maximum: {
              unit: "hour",
              value: 3,
            },
          },
        },
      },
    ],
    success_url: `${frontendOrigin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendOrigin}/cart`,
  };

  if (couponCode) {
    const coupon = await Coupon.findOne({ couponName: couponCode.toUpperCase() });
    if (coupon && coupon.expire > Date.now()) {
      // Create a temporary Stripe coupon for the session
      const stripeCoupon = await stripe.coupons.create({
        percent_off: coupon.discount,
        duration: "once",
      });
      sessionParams.discounts = [{ coupon: stripeCoupon.id }];
    }
  }

  const session = await stripe.checkout.sessions.create(sessionParams);
  res.status(200).json({ url: session.url });
});

// Send stripe API Key   =>   /api/v1/stripeapi
exports.sendStripApi = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    stripeApiKey: process.env.STRIPE_API_KEY,
  });
});
