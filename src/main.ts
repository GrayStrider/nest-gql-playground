import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { sig } from '@qdev/utils-ts'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'
import { PORT, HOST } from '@config'


async function bootstrap () {
	const app = await NestFactory.create <NestExpressApplication> (AppModule)
	app.useGlobalPipes (new ValidationPipe ())
	app.useGlobalFilters(new HttpExceptionFilter())
	await app.listen (PORT)
	sig.success (`Application is running on: http://${HOST}:${PORT}`)
}

bootstrap ()
