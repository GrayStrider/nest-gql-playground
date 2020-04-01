import { NestFactory } from '@nestjs/core'
import { PORT, HOST, NODE_ENV } from '@config'
import { sig, toDefault } from '@qdev/utils-ts'
import { KanbanModule } from '@M/kanban/kanban.module'


async function bootstrap () {
	toDefault (NODE_ENV,
		new Error ('process.env is undefined!'))
	sig.info (`Environment: ${NODE_ENV}`)
	const app = await NestFactory.create (KanbanModule)
	await app.listen (PORT)
	sig.success (`Application is running on: http://${HOST}:${PORT}`)
}

bootstrap ()
