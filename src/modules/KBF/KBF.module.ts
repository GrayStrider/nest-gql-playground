import { Module, ValidationPipe, NestModule, Inject, MiddlewareConsumer } from '@nestjs/common'
import { GraphQLModule, GqlModuleOptions } from '@nestjs/graphql'
import { TaskResolver } from '@M/KBF/resolvers/task.resolver'
import { BoardResolver } from '@M/KBF/resolvers/board.resolver'
import { DBModule } from '@M/db/db.module'
import { ColorResolver } from '@M/KBF/resolvers/color.resolver'
import { APP_PIPE, APP_INTERCEPTOR, APP_FILTER, APP_GUARD } from '@nestjs/core'
import { validatorOptions } from '@M/cats/config/validator'
import { ApolloError } from 'apollo-server-errors'
import { prop } from 'ramda'
import { CommentResolver } from '@M/KBF/resolvers/comment.resolver'
import { UserResolver } from '@M/KBF/resolvers/user.resolver'
import { TagResolver } from '@M/KBF/resolvers/tag.resolver'
import { ErrorCodes } from '@/common/errors'
import { Request, Response } from 'express'
import { REDIS, Redis } from '@/common/constants'
import { makeRedis } from '@M/redis/redis.provider'
import ConnectRedis from 'connect-redis'
import session from 'express-session'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import cookieParser from 'cookie-parser'
import { get } from 'config'
import { TimeoutInterceptor } from '@/common/interceptors/timeout.interceptor'
import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor'
import { GqlExceptionFilter } from '@/common/filters/gql-exception.filter'
import { GqlAuthGuard } from '@M/auth/guards/gql-auth.guard'

const dataSources = () => ({
	catFacts: new CatFactsAPI ()
})

interface ExpresssCtx {
	req: Request
	res: Response
}

const context = ({ req, res }: ExpresssCtx) => ({
	user: req.user,
	session: req.session
})

export type Context = ReturnType<typeof context>

const apolloOptions: GqlModuleOptions = {
	autoSchemaFile: 'src/graphql/generated/schema.graphql',
	playground: {
		settings: {
			'request.credentials': 'include'
		}
	},
	context
}

const GqlValidationPipe = new ValidationPipe ({
	...validatorOptions,
	exceptionFactory (errors) {
		const validationErrors = errors.map
		(prop ('constraints'))
		
		return new ApolloError ('Validation failed', ErrorCodes.VALIDATION_ERROR, { validationErrors })
	}
})

const RedisStore = ConnectRedis (session)

const redisPubSub = new RedisPubSub ({
	publisher: makeRedis (),
	subscriber: makeRedis ()
})

@Module ({
	imports: [
		GraphQLModule.forRoot (apolloOptions),
		DBModule
	],
	providers: [
		BoardResolver,
		TaskResolver,
		UserResolver,
		TagResolver,
		CommentResolver,
		ColorResolver,
		{ provide: APP_PIPE, useValue: GqlValidationPipe },
		{ provide: REDIS.SESSION, useValue: makeRedis () },
		{ provide: REDIS.PUBSUB, useValue: redisPubSub },
		{ provide: APP_INTERCEPTOR, useClass: TimeoutInterceptor },
		{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
		{ provide: APP_FILTER, useClass: GqlExceptionFilter }
	],
	controllers: [],
	exports: []
})

export class KBFModule implements NestModule {
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

