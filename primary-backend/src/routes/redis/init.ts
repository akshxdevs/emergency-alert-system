import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redisClient = new Redis(redisUrl, {
  tls: {
    rejectUnauthorized: false
  }
});

redisClient.on('connect', () => {
  console.log('✅ Connected to Upstash Redis');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});
