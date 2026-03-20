import Redis from "ioredis";
import { REDIS_URL } from "../../config";

export const redisClient = new Redis(REDIS_URL, {
  tls: {
    rejectUnauthorized: false
  }
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err: Error) => {
  console.error('Redis connection error:', err);
});
