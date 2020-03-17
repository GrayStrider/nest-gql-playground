import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export const User = createParamDecorator (
	(data: keyof User, ctx: ExecutionContext) => {
		const { user } = ctx.switchToHttp ().getRequest <Request> ()
		return data ? user && user[data] : user
	}
)
