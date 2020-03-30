import { Resolver, Args, Mutation, Query } from '@nestjs/graphql'
import { Task } from '@M/KBF/entity/Task'
import { TaskInput, TaskSearchInput } from '@M/KBF/inputs/task.input'
import { Promise as bb } from 'bluebird'
import { Tag } from '@M/KBF/entity/Tag'
import { BaseEntity } from 'typeorm'
import { ApolloError } from 'apollo-server-errors'
import { Board } from '@M/KBF/entity/Board'
import { find, head, uniq } from 'ramda'
import { SearchByIDInput } from '@M/KBF/inputs/shared/search-by-id.input'
import Errors, { ErrorCodes2 } from '@/common/errors'
import { toDefault } from '@qdev/utils-ts'

export const MAX_TASK_NUMBER = 3

@Resolver ()
export class TaskResolver {
	@Query (returns => [Task])
	async tasks (@Args ('searchBy', { nullable: true })
		             { boardNames }: TaskSearchInput) {
		
		
		return Task.find ()
	}
	
	@Query (returns => Task)
	async task (@Args () { id }: SearchByIDInput): Promise<Task> {
		return toDefault (
			await Task.findOne (id),
			new Errors.NotFound ('Task not found', { id }))
	}
	
	@Mutation (returns => Task)
	async addTask (
		@Args ('data') data: TaskInput): Promise<Task> {
		const { tagNames, colorName, columnName, swimlaneName, boardName, dates, ...rest } = data
		
		const board = toDefault (
			await Board.findOne ({ name: boardName }),
			new ApolloError (`Board <${boardName}> not found`,
				ErrorCodes2.NOT_FOUND,
				{ requestedName: boardName }))
		
		const color = colorName
			? toDefault (
				board.colors.find (c => c.name === colorName),
				new ApolloError
				(`Color <${colorName}> doesn't exist on board <${boardName}>`,
					ErrorCodes2.NOT_FOUND, { requestedColor: colorName }))
			: find (c => c.default, board.colors)
		
		const tags = await bb.reduce (uniq (toDefault (tagNames, [])),
			async (acc: Tag[], name) => {
				const tag = await Tag.findOne ({ name, board })
					?? Tag.create ({ name, board })
				return acc.concat (tag)
			}, []
		)
		
		
		const column = columnName
			? toDefault (
				board.columns.find (c => c.name === columnName),
				new ApolloError
				(`Column <${columnName}> doesn't exist on board <${boardName}>`, ErrorCodes2.NOT_FOUND,
					{ requestedColumn: columnName }))
			: head (board.columns)
		
		const swimlane = swimlaneName
			? toDefault (
				board.swimlanes.find (c => c.name === swimlaneName),
				new ApolloError
				(`Swimlane <${swimlaneName}> doesn't exist on board <${boardName}>`, ErrorCodes2.NOT_FOUND, {
					requestedSwimlane: swimlaneName
				})
			)
			: head (board.swimlanes)
		
		if (dates) {
		
		}
		
		
		return await Task.create
		({ ...rest, board, tags, color, column, swimlane }).save ()
	}
	
}

export async function checkIfMaxReached<C extends typeof BaseEntity> (numberOf: string, entity: C, max = 10.000) {
	const count = await entity.count ({
		take: max
	})
	
	if (count >= max) throw new ApolloError
	(`You've reached the maximum allowed amount of ${numberOf}: ${max}`, ErrorCodes2.LIMIT_REACHED,
		{
			entity: entity.name,
			max
		})
}
