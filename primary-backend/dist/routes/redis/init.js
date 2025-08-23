"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
exports.redisClient = new ioredis_1.default(redisUrl, {
    tls: {
        rejectUnauthorized: false
    }
});
exports.redisClient.on('connect', () => {
    console.log('Connected to Upstash Redis');
});
exports.redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});
