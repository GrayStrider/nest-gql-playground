import { CatsService } from './cats.service'
import { CatsController } from './cats.controller'
import { Module, NestModule, MiddlewareConsumer, ValidationPipe } from '@nestjs/common'
import { AuthMiddleware } from '@/common/middleware/auth.middleware'
import { APP_PIPE } from '@nestjs/core'

@Module ({
	controllers: [CatsController],
	providers: [CatsService,  {
		provide: APP_PIPE,
		useClass: ValidationPipe,
	}],
	exports: [CatsService]
})
export class CatsModule implements NestModule {
	configure (consumer: MiddlewareConsumer): void {
		consumer
			.apply(AuthMiddleware)
			.forRoutes('*')
	}
}
