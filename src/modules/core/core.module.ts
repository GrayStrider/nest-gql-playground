import { Module, Inject } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { LoggingInterceptor } from '@M/core/interceptors/logging.interceptor'
import { TransformInterceptor } from '@M/core/interceptors/transform.interceptor'
import { ConnectionModule } from '@M/connection/connection.module'
import { connection } from '@M/connection/connection.provider'
import { Tokens } from '@/common/constants'

@Module ({
	imports: [ConnectionModule],
	providers: [
		{ provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
		{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }
	]
})
export class CoreModule {
	constructor (@Inject (Tokens.CONNECTION) conn: string) {
		conn.toUpperCase()
	}
}
