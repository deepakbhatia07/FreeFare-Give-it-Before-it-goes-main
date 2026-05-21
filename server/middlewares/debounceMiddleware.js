// middlewares/debounceMiddleware.js
const { client: redis } = require("../utils/redisClient"); // CommonJS import

function debounceRequests(windowMs = 3000) {
  return async (req, res, next) => {
    // Only debounce write operations
    if (!["POST", "PUT", "PATCH"].includes(req.method)) return next();

    try {
      if (!redis.isOpen) return next();

      const key = `${req.ip}-${req.path}-${JSON.stringify(req.body)}`;
      const now = Date.now();

      const lastTime = await redis.get(key);

      if (lastTime && now - lastTime < windowMs) {
        const remaining = Math.ceil((windowMs - (now - lastTime)) / 1000);

        return res.status(429).json({
          error: `Duplicate request detected. Please wait ${remaining}s before retrying.`,
        });
      }

      // Set key with expiration
      await redis.set(key, now.toString(), {
        EX: Math.floor(windowMs / 1000),
      });

      next();
    } catch (err) {
      console.error("Debounce middleware error:", err);
      next(); // fail open
    }
  };
}

module.exports = { debounceRequests };
