import { Resolver, Mutation, Context as Ctx } from '@nestjs/graphql'
import { MyContext } from '@M/gql/gql.module'

@Resolver ()
export class AuthResolver {
	@Mutation (returns => Boolean)
	async logout (@Ctx () { session, user }: MyContext): Promise<Boolean> {
		return new Promise ((res, rej) => {
			session!.destroy (err => {
				if (err) {
					console.log (err)
					rej (false)
				}
				res (true)
			})
			
		})
	}
}
