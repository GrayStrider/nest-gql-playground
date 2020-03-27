import { Resolver, Args, Mutation, Query } from '@nestjs/graphql'
import { Board } from '@M/KBF/entity/Board'
import { Color } from '@M/KBF/entity/Color'
import { Maybe } from 'type-graphql'
import { TColumn } from '@M/KBF/entity/TColumn'
import { Swimlane } from '@M/KBF/entity/Swimlane'

export const defaultColors: [string, string, boolean][] = [
	['White', '#FDFFFC', true],
	['Green', '#2EC4B6', false],
	['Blue', '#011627', false],
	['Orange', '#FF9F1C', false],
	['Red', '#E71D36', false]
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
		return await Board.findOne ({ name })
	}
	
	
	@Mutation (returns => Board)
	async addBoard (@Args ('name') name: string)
		: Promise<Board> {
		const colors = defaultColors.map
		(([name, value, def]) => Color.create
		({ name, value, default: def }))
		const columns = defaultColumns.map
		(([name, taskLimit], index) => TColumn.create
		({ name, order: index, taskLimit }))
		const swimlanes = [Swimlane.create
			({ name: 'Default' })
		]
		
		return await Board.create
		({ name, colors, columns, swimlanes }).save ()
		
	}
}
