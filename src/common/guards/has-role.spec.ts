import { Role } from '@/common/roles.type'
import { isSE } from '@qdev/utils-ts'
import { hasRole } from '@/common/guards/roles.guard'
import { all } from 'ramda'
import { isEmpty } from 'fp-ts/lib/Array'

it ('should return false when no roles in common', async () => {
	expect.assertions (1)
	const roles: Role[] = ['admin']
	const user = {
		roles: ['guest'] as Role[]
	}
	isSE (hasRole (roles, user.roles), false)
})

it ('should return true when has roles in common', async () => {
	expect.assertions (1)
	const roles: Role[] = ['admin', 'guest']
	const user = {
		roles: ['guest'] as Role[]
	}
	isSE (hasRole (roles, user.roles), true)
})

it ('should return false when roles are empty', async () => {
	expect.assertions (1)
	const roles: Role[] = []
	const user = {
		roles: ['guest'] as Role[]
	}
	isSE (hasRole (roles, user.roles), false)
})
