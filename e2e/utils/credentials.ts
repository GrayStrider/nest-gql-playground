import { UserInput } from '@M/kanban/inputs/user.input'
import { pick } from 'ramda'

export const testBoardName = 'test board'
export const testUser: UserInput = {
	name: 'Ivan',
	password: 'aG2_ddddddd',
	email: 'test@test.com',
	confirmPassword: 'aG2_ddddddd'
}
export const credsOK = pick
(['email', 'password'], testUser)
