import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { AuthModule } from '@M/auth/auth.module'
import { redisSessionClient } from '@/DB/redis'
import { get } from 'config'
import session from 'express-session'
import ConnectRedis from 'connect-redis'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { LoggingInterceptor } from '@M/core/interceptors/logging.interceptor'
import cookieParser from 'cookie-parser'
import { GqlModule } from '@M/graphql/gql.module'

const RedisStore = ConnectRedis (session)

const Logger = { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }

@Module ({
	imports: [
		AuthModule,
		GqlModule
	],
	providers: [
		Logger
	]
})
export class AppModule implements NestModule {
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
						client: redisSessionClient,
						prefix: get ('redis.prefix.session')
					})
				})
			]).forRoutes ('*')
	}
}
