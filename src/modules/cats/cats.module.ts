import { CatsService } from './cats.service'
import { CatsController } from './cats.controller'
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { AuthMiddleware } from '@/common/middleware/auth.middleware'

@Module ({
	controllers: [CatsController],
	providers: [CatsService],
	exports: [CatsService]
})
export class CatsModule implements NestModule {
	configure (consumer: MiddlewareConsumer): void {
		consumer
			.apply(AuthMiddleware)
			.forRoutes('*')
	}
}
