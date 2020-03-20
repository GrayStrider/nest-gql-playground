import { createParamDecorator } from '@nestjs/common'

export const User = createParamDecorator (
	(data: keyof Express.User, { user }: Express.Request) => {
		return data ? user && user[data] : user
	}
)
