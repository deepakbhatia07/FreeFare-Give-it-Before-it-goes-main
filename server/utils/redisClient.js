// utils/redisClient.js
const { createClient } = require('redis');

const redisUrl = process.env.REDIS_URL || undefined;
const redisOptions = {};

if (process.env.REDIS_HOST) {
  redisOptions.socket = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
  };
  if (process.env.REDIS_PASSWORD) redisOptions.password = process.env.REDIS_PASSWORD;
}

const client = createClient(redisUrl ? { url: redisUrl } : redisOptions);

client.on('error', (err) => console.warn('⚠️ Redis Client Error (Optional):', err.message));
client.on('connect', () => console.log('✅ Redis connecting...'));
client.on('ready', () => console.log('✅ Redis ready'));

async function connectRedis() {
  try {
    // Only connect if Redis is configured
    if (!redisUrl && !process.env.REDIS_HOST) {
      console.log('⏭️ Redis not configured - skipping connection');
      return;
    }
    
    if (!client.isOpen) {
      await client.connect();
    }
  } catch (err) {
    console.warn('⚠️ Redis connection failed (Optional):', err.message);
  }
}

module.exports = { client, connectRedis };
