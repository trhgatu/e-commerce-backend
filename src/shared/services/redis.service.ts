import redisClient from "@config/redis";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getCache = async <T = any>(key: string): Promise<T | null> => {
  try {
    const cached = await redisClient.get(key);
    if (cached) {
      console.log(`[REDIS HIT] ${key}`);
    } else {
      console.log(`[REDIS MISS] ${key}`);
    }
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    console.error(`Redis get error (key: ${key})`, err);
    return null;
  }
};

export const setCache = async (
  key: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  ttlSeconds = 600
): Promise<void> => {
  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(data));
  } catch (err) {
    console.error(`Redis set error (key: ${key})`, err);
  }
};

export const deleteCache = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error(`Redis delete error (key: ${key})`, err);
  }
};

export const deleteKeysByPattern = async (pattern: string): Promise<void> => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (err) {
    console.error(`Redis pattern delete error (${pattern})`, err);
  }
};
