import { Resolver, Args, Mutation, Query } from '@nestjs/graphql'
import { Board } from '@M/KBF/entity/Board'
import { Color } from '@M/KBF/entity/Color'
import { Maybe } from 'type-graphql'

export const defaultColors = [
	['White', '#FDFFFC'],
	['Green', '#2EC4B6'],
	['Blue', '#011627'],
	['Orange', '#FF9F1C'],
	['Red', '#E71D36']
]

@Resolver ()
export class BoardResolver {
	@Query (returns => [Board])
	async boards ()
		: Promise<Board[]> {
		return Board.find ()
	}
	
	@Query (returns => Board)
	async board (@Args ('name') name: string)
		: Promise<Maybe<Board>> {
		return await Board.findOne (name)
	}
	
	
	@Mutation (returns => Board)
	async addBoard (@Args ('name') name: string)
		: Promise<Board> {
		const colors = defaultColors.map
		(([name, value]) => Color.create ({ name, value }))
		return await Board.create ({ name, colors }).save ()
		
	}
}
