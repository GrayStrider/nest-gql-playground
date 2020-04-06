import { NestFactory, Reflector } from '@nestjs/core'
import { PORT, HOST, NODE_ENV } from '@config'
import { sig, toDefault } from '@qdev/utils-ts'
import { AppModule } from '@M/app/app.module'
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard'


async function bootstrap () {
	toDefault (NODE_ENV,
		new Error ('process.env is undefined!'))
	sig.info (`Environment: ${NODE_ENV}`)
	const app = await NestFactory.create (AppModule)
	app.useGlobalGuards(new GqlAuthGuard (new Reflector ()) )
	await app.listen (PORT)
	sig.success (`Application is running on: http://${HOST}:${PORT}`)
}

bootstrap ()
