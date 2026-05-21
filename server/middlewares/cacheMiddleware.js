// middlewares/cacheMiddleware.js
const { client: redis } = require('../utils/redisClient');

const defaultTTL = 20; // seconds

function buildCacheKey(req) {
  const base = `${req.method}:${req.originalUrl.split('?')[0]}`;
  const sortedQuery = Object.keys(req.query || {}).sort().map(k => `${k}=${req.query[k]}`).join('&');
  const qpart = sortedQuery ? `?${sortedQuery}` : '';
  const userPart = req.user ? `|u:${req.user._id}` : '';
  return `cache:${base}${qpart}${userPart}`;
}

const cache = (ttl = defaultTTL) => {
  return async (req, res, next) => {
    // only GET should be cached by this middleware
    if (req.method !== 'GET') return next();

    try {
      if (!redis.isOpen) return next();

      const key = buildCacheKey(req);
      const cached = await redis.get(key);
      if (cached) {
        // return cached JSON
        const parsed = JSON.parse(cached);
        return res.json(parsed);
      }

      // monkey-patch res.json to store response
      const originalJson = res.json.bind(res);
      res.json = async (body) => {
        try {
          await redis.setEx(key, Math.max(5, Math.floor(ttl)), JSON.stringify(body));
        } catch (err) {
          console.warn('Redis setEx failed', err);
        }
        return originalJson(body);
      };

      return next();
    } catch (err) {
      console.warn('Cache middleware error', err);
      return next();
    }
  };
};

module.exports = cache;
