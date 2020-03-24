import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'
import { TimeoutInterceptor } from '@/common/interceptors/timeout.interceptor'
import { PORT, HOST, NODE_ENV } from '@config'
import { sig } from '@qdev/utils-ts'
import { AppModule } from '@M/app/app.module'


async function bootstrap () {
	if (!NODE_ENV) sig.error ('process.env is undefined!')
	else sig.info (`Environment: ${NODE_ENV}`)
	const app = await NestFactory.create <NestExpressApplication> (AppModule)
	await app.listen (PORT)
	sig.success (`Application is running on: http://${HOST}:${PORT}`)
}

bootstrap ()
