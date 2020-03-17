import { Role } from '@/common/roles.type'
import { isEmpty } from 'fp-ts/lib/Array'
import { all } from 'ramda'
import { isSE } from '@qdev/utils-ts'

export const hasAllRoles = (a: Role[], b: Role[]) =>
	isEmpty (a)
		? true
		: all (role => b.includes (role), a)


it ('should return true when all roles present', async () => {
	expect.assertions (3)
	isSE (hasAllRoles (['guest', 'admin'], ['admin', 'guest']), true)
	isSE (hasAllRoles (['guest', 'admin'], ['guest', 'admin']), true)
	isSE (hasAllRoles (['guest'], ['guest']), true)
})

it ('should return false when not all are present', async () => {
	expect.assertions (5)
	isSE (hasAllRoles (['guest', 'admin'], ['admin']), false)
	isSE (hasAllRoles (['guest', 'admin'], ['admin']), false)
	isSE (hasAllRoles ([], ['admin']), true)
	isSE (hasAllRoles (['admin'], ['guest']), false)
	isSE (hasAllRoles (['admin'], []), false)
})
