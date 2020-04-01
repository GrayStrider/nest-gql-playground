import { Resolver, Args, Mutation, Query } from '@nestjs/graphql'
import { Task } from '@M/kanban/entity/Task'
import { TaskInput, TaskSearchInput } from '@M/kanban/inputs/task.input'
import { Promise as bb } from 'bluebird'
import { Tag } from '@M/kanban/entity/Tag'
import { BaseEntity } from 'typeorm'
import { ApolloError } from 'apollo-server-errors'
import { Board } from '@M/kanban/entity/Board'
import { find, head, uniq } from 'ramda'
import { SearchByIDInput } from '@M/kanban/inputs/common/search-by-id.input'
import Errors, { ErrorCodes, NotFoundByIDError } from '@/common/errors'
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
			NotFoundByIDError ('task', id))
	}
	
	@Mutation (returns => Task)
	async addTask (
		@Args ('data') data: TaskInput): Promise<Task> {
		const { tagNames, colorName, columnName, swimlaneName, boardName, dates, ...rest } = data
		
		const board = await getBoard (boardName)
		
		const color = colorName
			? toDefault (
				board.colors.find (c => c.name === colorName),
				new Errors.NotFound
				(`Color <${colorName}> doesn't exist on board <${boardName}>`, { colorName, boardName }))
			: find (c => c.default, board.colors)
		
		const column = columnName
			? toDefault (
				board.columns.find (c => c.name === columnName),
				new Errors.NotFound
				(`Column <${columnName}> doesn't exist on board <${boardName}>`, { columnName, boardName }))
			: head (board.columns)
		
		const swimlane = swimlaneName
			? toDefault (
				board.swimlanes.find (c => c.name === swimlaneName),
				new Errors.NotFound
				(`Swimlane <${swimlaneName}> doesn't exist on board <${boardName}>`, { swimlaneName }))
			: head (board.swimlanes)
		
		if (dates) {
		
		}
		
		const tags = await bb.reduce
		(uniq (toDefault (tagNames, [])),
			async (acc: Tag[], name) => {
				const tag = toDefault (
					await Tag.findOne ({ name, board }),
					Tag.create ({ name, board }))
				return acc.concat (tag)
			}, [])
		
		
		return await Task.create
		({ board, tags, color, column, swimlane, ...rest }).save ()
	}
	
}

export async function checkIfMaxReached<C extends typeof BaseEntity> (numberOf: string, entity: C, max = 10.000) {
	const count = await entity.count ({
		take: max
	})
	
	if (count >= max) throw new ApolloError
	(`You've reached the maximum allowed amount of ${numberOf}: ${max}`, ErrorCodes.LIMIT_REACHED,
		{
			entity: entity.name,
			max
		})
}

export async function getBoard (boardName: string) {
	return toDefault (
		await Board.findOne ({ name: boardName }),
		new Errors.NotFound
		(`Board <${boardName}> not found`, { boardName }))
}
