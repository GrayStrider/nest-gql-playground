import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { User } from '@M/KBF/entity/User'
import { SearchByIDInput } from '@M/KBF/inputs/shared/search-by-id.input'
import Maybe from 'graphql/tsutils/Maybe'
import { UserInput } from '@M/KBF/inputs/user.input'

@Resolver()
export class UserResolver {
	@Query(returns => User)
	async user (@Args() data: SearchByIDInput): Promise<Maybe<User>> {
		return User.findOne(data)
	}
	
	@Mutation(returns => User)
	async register (@Args('data') data: UserInput): Promise<User> {
		
		return User.create()
	}
}
