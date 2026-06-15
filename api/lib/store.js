import { DB } from "./defaultDB.js";

const DB_KEY = "linktree_db";
let memoryStore = structuredClone(DB);

function getRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (url && token) return { url, token };
  return null;
}

async function getRedis() {
  const config = getRedisConfig();
  const { Redis } = await import("@upstash/redis");
  return new Redis(config);
}

export async function readDB() {
  const config = getRedisConfig();
  if (config) {
    const redis = await getRedis();
    const data = await redis.get(DB_KEY);
    return data || structuredClone(DB);
  }
  return structuredClone(memoryStore);
}

export async function writeDB(data) {
  const config = getRedisConfig();
  if (config) {
    const redis = await getRedis();
    await redis.set(DB_KEY, data);
    return;
  }
  memoryStore = structuredClone(data);
}

export async function resetDB() {
  const fresh = structuredClone(DB);
  await writeDB(fresh);
  return fresh;
}
