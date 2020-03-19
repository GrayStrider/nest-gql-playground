import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { HelloModule } from '@M/hello/hello.module'
import { CatsModule } from '@M/cats/cats.module'
import { CoreModule } from '@M/core/core.module'
import { AuthMiddleware } from '@/common/middleware/auth.middleware'
import { LoggerMiddleware } from '@/common/middleware/logger.middleware'
import { AuthModule } from '@M/auth/auth.module'
import { ConfigModule } from '@M/config/config.module'

@Module ({
	imports: [
		CoreModule,
		HelloModule,
		CatsModule,
		AuthModule,
		ConfigModule.register({ folder: './../config' })
	]
})
export class AppModule implements NestModule {
	public configure (consumer: MiddlewareConsumer): void {
		consumer
			.apply (AuthMiddleware, LoggerMiddleware)
			.forRoutes ('*')
	}
}
