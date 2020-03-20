import { Module, Inject, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { Tokens } from '@/common/constants'
import { ConfigModule } from '@M/config/config.module'

@Module ({
	imports: [
		ConfigModule.register ({ folder: './../config' })
	],
	providers: []
})
export class CoreModule implements NestModule {
	constructor (@Inject (Tokens.CONNECTION) conn: string) {
		conn.toUpperCase ()
	}
	
	configure (consumer: MiddlewareConsumer): void {
		consumer.apply ([]).forRoutes ('*')
	}
}
