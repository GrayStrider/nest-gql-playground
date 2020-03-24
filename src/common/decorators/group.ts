import { applyDecorators, SetMetadata } from '@nestjs/common'

const Auth = (...roles: Express.Role[]) =>
	applyDecorators (
		SetMetadata ('roles', roles) /*, ...*/
	)
