import { createParamDecorator } from '@nestjs/common'
import { MyContext } from '@M/gql/gql.module'
import { GqlExecutionContext } from '@nestjs/graphql'

export const SessionUser = createParamDecorator (
	(data, context) => {
		const eCtx = GqlExecutionContext.create (context)
		const {user} = eCtx.getContext<MyContext> ()
		return user
	}
)
