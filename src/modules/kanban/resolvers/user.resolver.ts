import { Resolver, Query, Args, Mutation, Context as Ctx } from '@nestjs/graphql'
import { User } from '@M/kanban/entity/User'
import { SearchByIDInput } from '@M/kanban/inputs/shared/search-by-id.input'
import Maybe from 'graphql/tsutils/Maybe'
import { UserInput, LoginWithEmailInput } from '@M/kanban/inputs/user.input'
import Errors from '@/common/errors'
import { hash, compare } from 'bcryptjs'
import { toDefault } from '@qdev/utils-ts'
import { Context } from '@M/kanban/KBF.module'
import { keys } from 'ramda'


@Resolver ()
export class UserResolver {
	@Query (returns => User)
	async user (@Args () { id }: SearchByIDInput): Promise<Maybe<User>> {
		return User.findOne (id, {
			select: []
		})
	}
	
	@Mutation (returns => User)
	async register (@Args ('data') data: UserInput): Promise<User> {
		const { name, confirmPassword, email } = data
		if (data.password !== confirmPassword)
			throw new Errors.Validation
			('Passwords don\'t match')
		
		if (await User.findOne ({ email }))
			throw new Errors.NotUnique
			('User with this email already exists. Try restoring password here: TODO') //TODO
		
		const password = await hash (data.password, 10)
		
		return User.create ({ name, password, email }).save ()
	}
	
	@Mutation (returns => User)
	async loginWithEmail
	(@Args ('data') data: LoginWithEmailInput,
	 @Ctx () {dataSources, session, user}: Context): Promise<User> {
		const { password, email } = data
		
		const invalidCredentialsError = new Errors.InvalidCredentials
		('Invalid login or password. Try restoring them here: TODO')
		// TODO
		const userData = toDefault (
			await User.findOne ({ email }),
			invalidCredentialsError)
		
		const hash = toDefault (
			userData.password,
			new Errors.NotFound ('This user does not have a password set. Log in using the provider you\'ve signed up with'))
		
		toDefault (
			await compare (password, hash),
			invalidCredentialsError)
		
		
		return userData
	}
}
