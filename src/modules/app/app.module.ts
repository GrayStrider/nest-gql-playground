import { Module, NestModule, MiddlewareConsumer, Inject } from '@nestjs/common'
import { AuthModule } from '@M/auth/auth.module'
import { get } from 'config'
import session from 'express-session'
import ConnectRedis from 'connect-redis'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { LoggingInterceptor } from '@M/core/interceptors/logging.interceptor'
import cookieParser from 'cookie-parser'
import { KBFModule } from '@M/KBF/KBF.module'
import { DBModule } from '@M/typeorm/db.module'
import { HelloModule } from '@M/hello/hello.module'
import { REDIS, Redis } from '@/common/constants'
import { makeRedis } from '@M/redis/redis.provider'
import { RedisPubSub } from 'graphql-redis-subscriptions'

const RedisStore = ConnectRedis (session)


@Module ({
	imports: [
		DBModule,
		AuthModule,
		KBFModule,
		HelloModule
	],
	providers: [
		{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
		{ provide: REDIS.SESSION, useValue: makeRedis () },
		{ provide: REDIS.PUBSUB, useValue: new RedisPubSub ({
				publisher: makeRedis (),
				subscriber: makeRedis ()
			})
		}
	]
})
export class AppModule implements NestModule {
	@Inject (REDIS.SESSION)
	private redis: Redis
	
	public configure (consumer: MiddlewareConsumer): void {
		consumer
			.apply ([
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
