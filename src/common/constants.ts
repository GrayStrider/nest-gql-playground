import redis from 'redis'
import { RedisPubSub as type } from 'graphql-redis-subscriptions'

export enum REDIS {
	SESSION = 'SESSION',
	PUBSUB = 'PUBSUB'
}

export type Redis = redis.RedisClient
export type RedisPubSub = type
