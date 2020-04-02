import { Resolver, Args, Mutation, Query } from '@nestjs/graphql'
import { Swimlane } from '@M/kanban/entity/Swimlane'
import { toDefault } from '@qdev/utils-ts'
import Errors from '@/common/errors'
import { SwimlaneInput, FindSwimlaneInput } from '@M/kanban/inputs/swimlane.input'
import { getBoard } from '@M/kanban/resolvers/task.resolver'

@Resolver ()
export class SwimlaneResolver {
	@Query (returns => [Swimlane])
	async swimlanes (@Args ('data') { id, name, boardName, description }: FindSwimlaneInput): Promise<Swimlane[]> {
		const promise = await Swimlane.createQueryBuilder ('swim')
			.leftJoinAndSelect ('swim.board', 'board')
			.where (`board.name = :boardName`, { boardName })
			.getMany ()
		console.log (promise)
		return promise
	}
	
	@Query (returns => Swimlane)
	async swimlane (@Args ('data') { id, name, boardName, description }: FindSwimlaneInput): Promise<Swimlane> {
		const board = await getBoard (boardName)
		return toDefault (
			await Swimlane.findOne ({ name }),
			new Errors.NotFound (`Swimlane <${name}> was not found`)
		)
	}
	
	
	@Mutation (returns => Swimlane)
	async addSwimlane (@Args ('data') { boardName, description, name, order }: SwimlaneInput): Promise<Swimlane> {
		const board = await getBoard (boardName)
		const order_ = toDefault (order,
			await Swimlane.count ())
		return Swimlane.create ({ board, description, name, order: order_ })
			.save ()
	}
}
