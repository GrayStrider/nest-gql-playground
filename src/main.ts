import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { sig } from '@qdev/utils-ts'
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter'

async function bootstrap () {
	const app = await NestFactory.create <NestExpressApplication> (AppModule)
	app.useGlobalPipes (new ValidationPipe ())
	app.useGlobalFilters(new HttpExceptionFilter())
	await app.listen (3000)
	sig.success (`Application is running on: ${await app.getUrl ()}`)
}

bootstrap ()
