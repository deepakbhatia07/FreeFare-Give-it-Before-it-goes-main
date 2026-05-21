// utils/cacheUtils.js
const { client: redis } = require('./redisClient');

async function delByPattern(pattern) {
  try {
    if (!redis.isOpen) return 0;
    // pattern e.g. 'cache:GET:/api/items*'
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    return keys.length;
  } catch (err) {
    console.warn('delByPattern error', err);
    return 0;
  }
}

module.exports = { delByPattern };