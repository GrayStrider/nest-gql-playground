import { SetMetadata } from '@nestjs/common'

export const Roles = (...roles: Express.Role[]) =>
	SetMetadata ('roles', roles)
