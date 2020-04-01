import { Module } from '@nestjs/common'
import { GraphQLModule, GqlModuleOptions } from '@nestjs/graphql'
import { Request, Response } from 'express'

interface ExpresssCtx {
	req: Request
	res: Response
}

const context = ({ req, res }: ExpresssCtx) => ({
	user: req.user,
	session: req.session
})

export type Context = ReturnType<typeof context>

const apolloOptions: GqlModuleOptions = {
	autoSchemaFile: 'src/graphql/generated/schema.graphql',
	playground: {
		settings: {
			'request.credentials': 'include'
		}
	},
	context
}
@Module ({
	imports: [GraphQLModule.forRoot (apolloOptions)]
})
export class GqlModule {}
