import { Module, Inject, MiddlewareConsumer, ValidationPipe, OnModuleInit } from '@nestjs/common'
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
import { APP_PIPE, APP_FILTER, APP_GUARD, Reflector } from '@nestjs/core'
import { validatorOptions } from '@config'
import { ApolloError } from 'apollo-server-errors'
import { ErrorCodes } from '@/common/errors'
import { GqlExceptionFilter } from '@/common/filters/gql-exception.filter'
import { AuthModule } from '@M/auth/auth.module'
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard'

const RedisStore = ConnectRedis (session)

const redisPubSub = new RedisPubSub ({
	publisher: makeRedis (),
	subscriber: makeRedis ()
})

const validationPipe = new ValidationPipe ({
	...validatorOptions,
	exceptionFactory (errors) {
		const validationErrors = errors.map (e => e.constraints)
		
		return new ApolloError (`Validation failed with ${errors.length} errors`, ErrorCodes.VALIDATION_ERROR, { validationErrors })
	}
})

@Module ({
	imports: [
		KanbanModule,
		
		AuthModule,
		GqlModule,
		DBModule
	],
	providers: [
		{ provide: REDIS.SESSION, useValue: makeRedis () },
		{ provide: REDIS.PUBSUB, useValue: redisPubSub },
		
		{ provide: APP_PIPE, useValue: validationPipe },
		{ provide: APP_FILTER, useClass: GqlExceptionFilter },
		{ provide: APP_GUARD, useValue: new GqlAuthGuard (new Reflector ()) }
	]
})
export class AppModule implements OnModuleInit {
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
	
	async onModuleInit () {
		await makeRedis ().flushdb ()
	}
}
