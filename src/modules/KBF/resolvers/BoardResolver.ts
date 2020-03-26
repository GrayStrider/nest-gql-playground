import { Resolver, Args, Mutation, Query } from '@nestjs/graphql'
import { Board } from '@M/KBF/entity/Board'
import { Color } from '@M/KBF/entity/Color'
import { Maybe } from 'type-graphql'
import { TColumn } from '@M/KBF/entity/TColumn'
import { Swimlane } from '@M/KBF/entity/Swimlane'

export const defaultColors: [string, string][] = [
	['White', '#FDFFFC'],
	['Green', '#2EC4B6'],
	['Blue', '#011627'],
	['Orange', '#FF9F1C'],
	['Red', '#E71D36']
]

export const defaultColumns: [string, number][] = [
	['To-do', 0],
	['Do today', 0],
	['In progress', 3],
	['Done', 0]
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
		const columns = defaultColumns.map
		(([name, taskLimit], index) => TColumn.create
		({ name, order: index, taskLimit }))
		const swimlanes = [
			Swimlane.create
			({ name: 'Default' })
		]
		return await Board.create
		({ name, colors, columns, swimlanes }).save ()
		
	}
}
