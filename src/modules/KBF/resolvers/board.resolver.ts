import { Resolver, Args, Mutation, Query } from '@nestjs/graphql'
import { Board } from '@M/KBF/entity/Board'
import { Color, defaultColors } from '@M/KBF/entity/Color'
import { Maybe } from 'type-graphql'
import { TColumn, defaultColumns } from '@M/KBF/entity/TColumn'
import { Swimlane } from '@M/KBF/entity/Swimlane'
import { FindBoardInput, AddBoardInput } from '@M/KBF/inputs/board.input'

@Resolver ()
export class BoardResolver {
	@Query (returns => [Board])
	async boards (): Promise<Board[]> {
		return Board.find ()
	}
	
	@Query (returns => Board)
	async board (@Args () { name }: FindBoardInput): Promise<Maybe<Board>> {
		return await Board.findOne ({ name })
	}
	
	
	@Mutation (returns => Board)
	async addBoard (@Args ('data') data: AddBoardInput): Promise<Board> {
		const { name, columnsParams, swimlaneNames } = data
		
		const colors = defaultColors.map
		(([name, value, def]) => Color.create
		({ name, value, default: def }))
		
		const columns = columnsParams
			? columnsParams.map (TColumn.create)
			: defaultColumns.map
			(([name, order, taskLimit]) => TColumn.create
			({ name, order, taskLimit }))
		
		const swimlanes = swimlaneNames
			? swimlaneNames.map (name => Swimlane.create ({ name }))
			: [Swimlane.create ({ name: 'Default' })]
		
		return await Board.create
		({ name, colors, columns, swimlanes }).save ()
		
	}
}
