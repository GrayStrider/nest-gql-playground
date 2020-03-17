import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { sig } from '@qdev/utils-ts'

async function bootstrap () {
	const app = await NestFactory.create <NestExpressApplication> (AppModule)
	app.useGlobalPipes (new ValidationPipe ())
	
	await app.listen (3000)
	sig.success (`Application is running on: ${await app.getUrl ()}`)
}

bootstrap ()
