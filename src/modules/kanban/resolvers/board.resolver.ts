import { Resolver, Args, Mutation, Query } from '@nestjs/graphql'
import { Board } from '@M/kanban/entity/Board'
import { TaskColor, defaultColors } from '@M/kanban/entity/TaskColor'
import { TColumn, defaultColumns } from '@M/kanban/entity/TColumn'
import { Swimlane } from '@M/kanban/entity/Swimlane'
import { FindBoardInput, AddBoardInput } from '@M/kanban/inputs/board.input'
import { toDefault } from '@qdev/utils-ts'
import Errors from '@/common/errors'
import { CtxUser } from '@M/gql/gql.module'
import { SessionUser } from '@/common/decorators/ctx.user.decorator'

export const SearchBy = Args ('searchBy', { nullable: true })

@Resolver ()
export class BoardResolver {
	@Query (returns => [Board])
	async boards (): Promise<Board[]> {
		return Board.find ()
	}
	
	@Query (returns => Board)
	async board (@Args () { name }: FindBoardInput): Promise<Board> {
		return toDefault (
			await Board.findOne ({ name }),
			new Errors.NotFound (`Board <${name}> was not found`)
		)
	}
	
	
	@Mutation (returns => Board)
	async addBoard (@Args ('data') data: AddBoardInput, @SessionUser () { id }: CtxUser): Promise<Board> {
		const { name, columnsParams, swimlaneNames } = data
		
		const taskColors = defaultColors.map
		(([name, value, def]) => TaskColor.create
		({ name, value, default: def }))
		// TODO verify order of swimlanes/columns
		const columns = columnsParams
			? columnsParams.map (coll => TColumn.create (coll))
			// columnsParams.map (TColumn.create) does NOT work, probaly because of this scoping
			: defaultColumns.map
			(([name, order, taskLimit]) => TColumn.create
			({ name, order, taskLimit }))
		
		const swimlanes = swimlaneNames
			? swimlaneNames.map (name => Swimlane.create ({ name }))
			: [Swimlane.create ({ name: 'Default' })]
		return await Board.create
			({ name, taskColors, columns, swimlanes, owner: { id } })
			.save ()
		
	}
	
}
