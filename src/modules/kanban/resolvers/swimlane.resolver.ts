import { Resolver, Args, Mutation, Query } from '@nestjs/graphql'
import { Swimlane } from '@M/kanban/entity/Swimlane'
import { toDefault } from '@qdev/utils-ts'
import Errors from '@/common/errors'
import { SwimlaneInput, FindSwimlaneInput } from '@M/kanban/inputs/swimlane.input'
import { getBoard } from '@M/kanban/resolvers/task.resolver'
import { keys } from 'ramda'

@Resolver ()
export class SwimlaneResolver {
	@Query (returns => [Swimlane])
	async swimlanes (@Args ('data') { boardName, ...rest }: FindSwimlaneInput): Promise<Swimlane[]> {
		let query = Swimlane.createQueryBuilder ('swim')
			.leftJoinAndSelect ('swim.board', 'board')
			.where (`board.name = :boardName`, { boardName })
		keys (rest).forEach ((param) => {
			const isString = typeof rest[param] === 'string'
			query = query.andWhere
			(`swim.${param} ${
				isString ? `LIKE` : '='
			} :value`, {
				value: isString
					? `%${rest[param]}%` : rest[param]
			})
		})
		return query.getMany ()
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
		let swlsOnBoard = Swimlane.createQueryBuilder ('swim')
			.leftJoinAndSelect ('swim.board', 'board')
			.where (`board.name = :boardName`, { boardName })
		
		const board = await getBoard (boardName)
		const order_ = toDefault (order,
			await swlsOnBoard.getCount ())
		return Swimlane.create ({ board, description, name, order: order_ })
			.save ()
	}
}
