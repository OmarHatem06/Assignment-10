import { json } from "express";
import { redisClient } from "./redis.connection.js";

export const revokedTokenprefix = ({ userid }) => {
  return `user:revokedToken:${userid}`;
};

export const revokedTokenkey = ({ userid, jti }) => {
  return `${revokedTokenprefix({ userid })}:${jti}`;
};

export const SET = async ({ key, value, ttl = null }) => {
  try {
    const data = typeof value != "string" ? JSON.stringify(value) : value;

    if (ttl) {
      return await redisClient.set(key, data, {
        expiration: { type: "EX", value: ttl },
      });
    }
    return await redisClient.set(key, data);
  } catch (error) {
    console.log("redis set:error", error);
  }
};

export const GET = async ({ key }) => {
  try {
    const isExistes = await redisClient.exists(key);
    if (!isExistes) {
      return false;
    }
    return await redisClient.get(key);
  } catch (error) {
    console.log("redis get:error", error);
  }
};

export const DEL = async ({ key }) => {
  try {
    const isExistes = await redisClient.exists(key);
    if (!isExistes) {
      return false;
    }
    return await redisClient.del(key);
  } catch (error) {
    console.log("redis del:error", error);
  }
};

export const EXPIRE = async ({ key, ttl }) => {
  try {
    const isExistes = await redisClient.exists(key);
    if (!isExistes) {
      return false;
    }
    return await redisClient.expire(key, ttl);
  } catch (error) {
    console.log("redis expire:error", error);
  }
};

export const UPDATE = async ({ key, value, ttl = null }) => {
  try {
    const isExists = await redisClient.exists(key);
    if (!isExists) {
      return false;
    }
    const data = typeof value != "string" ? JSON.stringify(value) : value;

    if (ttl) {
      return await redisClient.set(key, data, {
        expiration: { type: "EX", value: ttl },
      });
    }
    return await redisClient.set(key, data);
  } catch (error) {
    console.log("redis update:error", error);
  }
};
export const Key = async ({ pattern }) => {
  try {
    return redisClient.keys(pattern);
  } catch (error) {
    console.log("redis keys:error");
  }
};

export const ttl = async ({ key }) => {
  try {
    return await redisClient.ttl(key);
  } catch (error) {
    console.log("redis ttl:error");
  }
};
