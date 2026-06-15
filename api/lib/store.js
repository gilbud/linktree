import { DB } from "./defaultDB.js";

const DB_KEY = "linktree_db";
let memoryStore = structuredClone(DB);

function hasRedis() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

async function getRedis() {
  const { Redis } = await import("@upstash/redis");
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

export async function readDB() {
  if (hasRedis()) {
    const redis = await getRedis();
    const data = await redis.get(DB_KEY);
    return data || structuredClone(DB);
  }
  return structuredClone(memoryStore);
}

export async function writeDB(data) {
  if (hasRedis()) {
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
