import { Redis } from "ioredis"

const redisUrl = process.env.REDIS_URL || ""

const redis = new Redis(redisUrl)

export default redis;
