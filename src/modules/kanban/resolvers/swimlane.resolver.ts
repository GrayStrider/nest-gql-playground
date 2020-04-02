import { Resolver, Args, Mutation, Query } from '@nestjs/graphql'
import { Swimlane } from '@M/kanban/entity/Swimlane'
import { toDefault } from '@qdev/utils-ts'
import Errors from '@/common/errors'
import { SwimlaneInput, FindSwimlaneInput } from '@M/kanban/inputs/swimlane.input'
import { getBoard } from '@M/kanban/resolvers/task.resolver'
import { keys } from 'ramda'
import { SelectQueryBuilder } from 'typeorm'
import { AnyObject } from 'tsdef'

@Resolver ()
export class SwimlaneResolver {
	@Query (returns => [Swimlane])
	async swimlanes (@Args ('data') { boardName, ...rest }: FindSwimlaneInput): Promise<Swimlane[]> {
		return andWhere (rest)
		(swlsOnBoard (boardName)).getMany ()
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
			await swlsOnBoard (boardName).getCount ())
		return Swimlane.create ({ board, description, name, order: order_ })
			.save ()
	}
}

function swlsOnBoard (boardName: string) {
	return Swimlane.createQueryBuilder ('swim')
		.leftJoinAndSelect ('swim.board', 'board')
		.where (`board.name = :boardName`, { boardName })
}

export function andWhere (params: AnyObject) {
	return <T> (query: SelectQueryBuilder<T>): SelectQueryBuilder<T> => {
		keys (params).forEach (param => {
			const isString = typeof params[param] === 'string'
			query = query.andWhere
			(`swim.${param} ${isString ? `LIKE` : '='} :value`,
				{
					value: isString
						? `%${params[param]}%`
						: params[param]
				})
		})
		return query
	}
}
