import { NestFactory } from '@nestjs/core'
import { PORT, HOST, NODE_ENV } from '@config'
import { sig, toDefault } from '@qdev/utils-ts'
import { KBFModule } from '@M/KBF/KBF.module'


async function bootstrap () {
	toDefault (NODE_ENV,
		new Error ('process.env is undefined!'))
	sig.info (`Environment: ${NODE_ENV}`)
	const app = await NestFactory.create (KBFModule)
	await app.listen (PORT)
	sig.success (`Application is running on: http://${HOST}:${PORT}`)
}

bootstrap ()
