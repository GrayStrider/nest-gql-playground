import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'
import { TimeoutInterceptor } from '@/common/interceptors/timeout.interceptor'
import { PORT, HOST } from '@config'
import { sig } from '@qdev/utils-ts'
import { AppModule } from '@/app.module'


async function bootstrap () {
	const app = await NestFactory.create <NestExpressApplication> (AppModule)
	app.useGlobalPipes (new ValidationPipe)
	app.useGlobalFilters (new HttpExceptionFilter)
	app.useGlobalInterceptors (new TimeoutInterceptor)
	await app.listen (PORT)
	sig.success (`Application is running on: http://${HOST}:${PORT}`)
}

bootstrap ()
