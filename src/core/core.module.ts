import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { LoggingInterceptor } from '@/core/interceptors/logging.interceptor'
import { TransformInterceptor } from '@/core/interceptors/transform.interceptor'

@Module ({
	providers: [
		{ provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
		{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }
	]
})
export class CoreModule {}
