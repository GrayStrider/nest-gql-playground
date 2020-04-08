import { Module } from '@nestjs/common'
import { GraphQLModule, GqlModuleOptions } from '@nestjs/graphql'
import { Request, Response } from 'express'
import depthLimit from 'graphql-depth-limit'

interface ExpresssCtx {
	req: Request
	res: Response
}

export interface CtxUser {
	id: string
	name: string
	roles: string[]
}

const context = ({ req }: ExpresssCtx) => ({
	user: req.session?.user as CtxUser,
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
