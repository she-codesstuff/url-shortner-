import { createClient } from "redis";

const redisUrl =
  process.env.REDIS_URL ||
  `redis://${process.env.REDIS_HOST || "localhost"}:${process.env.REDIS_PORT || 6379}`;

console.log("REDIS_URL:", process.env.REDIS_URL);
console.log("Using Redis URL:", redisUrl);

export const client = createClient({
  url: redisUrl,
});

client.on("connect", () => {
  console.log(" Connected to Redis");
});

client.on("ready", () => {
  console.log(" Redis is ready");
});

client.on("error", (err) => {
  console.error(" Redis error:", err);
});

try {
  await client.connect();
  console.log(" Redis connection established");
} catch (err) {
  console.error(" Failed to connect to Redis:", err);
}

export const saveUrl = async (code, url) => {
  await client.set(code, JSON.stringify({ originalUrl: url }), {
    EX: 3600,
  });
};

export const getUrlByCode = async (code) => {
  const data = await client.get(code);

  if (!data) return null;

  return JSON.parse(data).originalUrl;
};
