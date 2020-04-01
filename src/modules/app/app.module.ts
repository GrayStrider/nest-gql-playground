import { Module, Inject, MiddlewareConsumer } from '@nestjs/common'
import { KanbanModule } from '@M/kanban/kanban.module'
import { REDIS, Redis } from '@/common/constants'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import { get } from 'config'
import { makeRedis } from '@M/redis/redis.provider'
import ConnectRedis from 'connect-redis'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { GqlModule } from '@M/gql/gql.module'
import { DBModule } from '@M/db/db.module'

const RedisStore = ConnectRedis (session)

const redisPubSub = new RedisPubSub ({
	publisher: makeRedis (),
	subscriber: makeRedis ()
})

@Module ({
	imports: [
		KanbanModule,
		
		GqlModule,
		DBModule
	],
	providers: [
		{ provide: REDIS.SESSION, useValue: makeRedis () },
		{ provide: REDIS.PUBSUB, useValue: redisPubSub }
	]
})
export class AppModule {
	@Inject (REDIS.SESSION)
	private redis: Redis
	
	public configure (consumer: MiddlewareConsumer): void {
		consumer.apply ([
			cookieParser (),
			session ({
				name: get ('cookie.name'),
				secret: get ('session.secret'),
				resave: false,
				saveUninitialized: true,
				unset: 'destroy',
				cookie: {
					maxAge: get ('cookie.maxAge'),
					secure: get ('cookie.secure') // TODO https://github.com/expressjs/session
				},
				store: new RedisStore ({
					client: this.redis,
					prefix: get ('redis.prefix.session')
				})
			})
		]).forRoutes ('*')
	}
}
