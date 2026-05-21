// middlewares/rateMiddleware.js
const rateLimit = require("express-rate-limit");

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000"); // 1 min
const max = parseInt(process.env.RATE_LIMIT_MAX || "100"); // 100 requests per min

const apiLimiter = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Try again later." }
});

module.exports = { apiLimiter };
