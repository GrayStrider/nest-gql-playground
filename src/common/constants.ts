import IORedis from 'ioredis'
import redis from 'redis'
import { RedisPubSub as type } from 'graphql-redis-subscriptions'

export enum Tokens {
	CONNECTION = 'CONNECTION',
	ASYNC_CONNECTION = 'ASYNC_CONNECTION',
	CONFIG_OPTIONS = 'CONFIG_OPTIONS'
}

export enum REDIS {
	SESSION = 'SESSION',
	PUBSUB = 'PUBSUB'
}

export type Redis = redis.RedisClient
export type RedisPubSub = type
