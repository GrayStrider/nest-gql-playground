import { isSE } from '@qdev/utils-ts'
import { hasRole } from '@/common/guards/roles.guard'

it ('should return false when no roles in common', async () => {
	expect.assertions (1)
	const roles: Express.Role[] = ['admin']
	const user = {
		roles: ['guest'] as Express.Role[]
	}
	isSE (hasRole (roles, user.roles), false)
})

it ('should return true when has roles in common', async () => {
	expect.assertions (1)
	const roles: Express.Role[] = ['admin', 'guest']
	const user = {
		roles: ['guest'] as Express.Role[]
	}
	isSE (hasRole (roles, user.roles), true)
})

it ('should return false when roles are empty', async () => {
	expect.assertions (1)
	const roles: Express.Role[] = []
	const user = {
		roles: ['guest'] as Express.Role[]
	}
	isSE (hasRole (roles, user.roles), false)
})
