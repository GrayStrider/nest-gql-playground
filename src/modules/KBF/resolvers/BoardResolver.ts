import { Resolver, Args, Mutation, Query } from '@nestjs/graphql'
import { Board } from '@M/KBF/entity/Board'

@Resolver()
export class BoardResolver {
	@Query(returns => Board)
	async board () {
		
		return
	}
	
	@Mutation(returns => Board)
	async addBoard (@Args('name') name: string) {
		return Board.create({name}).save()
	}
}
