import { createClient } from "redis";
import { REDIS_URI } from "../Configs/config.service.js";
export const redisClient = createClient({
  url: REDIS_URI,
  RESP: 2,
});

export const redisConnection = async () => {
  try {
    await redisClient.connect();
    console.log("redis is connected");
  } catch (error) {
    console.log("error", error);
  }
};
