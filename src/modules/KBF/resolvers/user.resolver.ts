import { Resolver, Query, Args } from '@nestjs/graphql'
import { User } from '@M/KBF/entity/User'
import { SearchByIDInput } from '@M/KBF/inputs/search-by-id.input'
import Maybe from 'graphql/tsutils/Maybe'

@Resolver()
export class UserResolver {
	@Query(returns => User)
	async user (@Args() data: SearchByIDInput): Promise<Maybe<User>> {
		return User.findOne(data)
	}
}
