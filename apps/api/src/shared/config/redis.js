import { Redis } from "ioredis";
const configuredRedisUrl = process.env.REDIS_URL?.trim();
// Upstash endpoints require TLS. If REDIS_URL uses redis:// for upstash,
// upgrade to rediss:// to avoid recurrent ECONNRESET errors in production.
const redisUrl = configuredRedisUrl?.includes("upstash.io")
    ? configuredRedisUrl.replace(/^redis:\/\//, "rediss://")
    : configuredRedisUrl;
const redisConnection = redisUrl
    ? new Redis(redisUrl, {
        maxRetriesPerRequest: null,
        retryStrategy: (attempt) => Math.min(attempt * 100, 2000),
    })
    : new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
        maxRetriesPerRequest: null,
        retryStrategy: (attempt) => Math.min(attempt * 100, 2000),
    });
redisConnection.on("error", (error) => {
    console.error("Redis connection error:", error);
});
export default redisConnection;
