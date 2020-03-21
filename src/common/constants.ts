import IORedis from 'ioredis'
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

export type Redis = IORedis.Redis
export type RedisPubSub = type
