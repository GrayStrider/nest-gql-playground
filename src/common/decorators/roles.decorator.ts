import { SetMetadata } from '@nestjs/common'
import { Role } from '@/common/roles.type'

export const Roles = (...roles: Role[]) =>
	SetMetadata ('roles', roles)
