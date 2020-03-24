import { Module, NestModule, MiddlewareConsumer, Inject, ValidationPipe } from '@nestjs/common'
import { AuthModule } from '@M/auth/auth.module'
import { get } from 'config'
import session, { SessionOptions } from 'express-session'
import ConnectRedis from 'connect-redis'
import { APP_INTERCEPTOR, APP_FILTER, APP_PIPE } from '@nestjs/core'
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor'
import cookieParser from 'cookie-parser'
import { KBFModule } from '@M/KBF/KBF.module'
import { DBModule } from '@M/db/db.module'
import { HelloModule } from '@M/hello/hello.module'
import { REDIS, Redis } from '@/common/constants'
import { makeRedis } from '@M/redis/redis.provider'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'
import { TimeoutInterceptor } from '@/common/interceptors/timeout.interceptor'

const RedisStore = ConnectRedis (session)

const redisPubSub = new RedisPubSub ({
	publisher: makeRedis (),
	subscriber: makeRedis ()
})

@Module ({
	imports: [
		DBModule,
		AuthModule,
		KBFModule,
		HelloModule
	],
	providers: [
		{ provide: APP_INTERCEPTOR, useClass: TimeoutInterceptor },
		{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
		{ provide: APP_PIPE, useClass: ValidationPipe },
		{ provide: APP_FILTER, useClass: HttpExceptionFilter },
		{ provide: REDIS.SESSION, useValue: makeRedis () },
		{ provide: REDIS.PUBSUB, useValue: redisPubSub }
	]
})
export class AppModule implements NestModule {
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
