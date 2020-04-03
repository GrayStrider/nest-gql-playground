import { Module } from '@nestjs/common'
import { GraphQLModule, GqlModuleOptions } from '@nestjs/graphql'
import { Request, Response } from 'express'
import depthLimit from 'graphql-depth-limit'

interface ExpresssCtx {
	req: Request
	res: Response
}

const context = ({ req }: ExpresssCtx) => ({
	user: req.session?.user,
	session: req.session!,
})

export type MyContext = ReturnType<typeof context>

const apolloOptions: GqlModuleOptions = {
	autoSchemaFile: 'src/graphql/generated/schema.graphql',
	playground: {
		settings: {
			'request.credentials': 'include'
		}
	},
	context,
	validationRules: [depthLimit(10)]
}
@Module ({
	imports: [GraphQLModule.forRoot (apolloOptions)]
})
export class GqlModule {}
