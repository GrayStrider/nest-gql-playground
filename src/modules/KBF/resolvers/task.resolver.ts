import { Resolver, Args, Mutation, Query } from '@nestjs/graphql'
import { Task } from '@M/KBF/entity/Task'
import { TaskInput, TaskSearchInput } from '@M/KBF/inputs/task.input'
import { Promise as bb } from 'bluebird'
import { Tag } from '@M/KBF/entity/Tag'
import { DeepPartial, BaseEntity } from 'typeorm'
import { ApolloError } from 'apollo-server-errors'
import { Board } from '@M/KBF/entity/Board'
import { find, head, uniq } from 'ramda'
import { SearchByIDInput } from '@M/KBF/inputs/shared/search-by-id.input'
import { NotFoundByIDError, ErrorCodes2 } from '@/common/errors'
import { Swimlane } from '@M/KBF/entity/Swimlane'
import { getOrThrow } from '@qdev/utils-ts'


export const MAX_TASK_NUMBER = 3

export const checkIfMaxReached =
	async <C extends typeof BaseEntity>
	(numberOf: string, entity: C, max = 10.000) => {
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

@Resolver ()
export class TaskResolver {
	@Query (returns => [Task])
	async tasks (@Args ('searchBy', { nullable: true })
		             { boardNames }: TaskSearchInput) {
		
		
		return Task.find ()
	}
	
	@Query (returns => Task)
	async task (@Args () { id }: SearchByIDInput): Promise<Task> {
		const [task] = await bb.all ([
			Task.findOne (id)
		])
		
		return getOrThrow(task, NotFoundByIDError ('task', id))
	}
	
	@Mutation (returns => Task)
	async addTask (
		@Args ('data') data: TaskInput): Promise<Task> {
		const {
			tagNames, colorName, columnName,
			swimlaneName, boardName, dates,
			...rest
		} = data
		
		let taskData: DeepPartial<Task> = {}
		
		const board = await Board.findOne ({ name: boardName })
		if (!board) {
			throw new ApolloError (`Board <${boardName}> not found`,
				ErrorCodes2.NOT_FOUND,
				{ requestedName: boardName })
		} else {
			taskData = { ...taskData, board }
		}
		
		if (colorName) {
			const color = find (c => c.name === colorName,
				board.colors)
			
			if (!color) throw new ApolloError
			(`Color <${colorName}> doesn't exist on board <${boardName}>`,
				ErrorCodes2.NOT_FOUND, { requestedColor: colorName })
			taskData = { ...taskData, color }
			
		} else {
			const color = find (c => c.default, board.colors)
			taskData = { ...taskData, color }
		}
		
		
		if (tagNames) {
			const tags = await bb.reduce (uniq (tagNames),
				async (acc: Tag[], name) => {
					const tag = await Tag.findOne ({ name, board })
						?? Tag.create ({ name, board })
					return acc.concat (tag)
				}, []
			)
			taskData = { ...taskData, tags }
		}
		
		if (columnName) {
			const column = find
			(c => c.name === columnName, board.columns)
			if (!column) throw new ApolloError
			(`Column <${columnName}> doesn't exist on board <${boardName}>`, ErrorCodes2.NOT_FOUND, {
				requestedColumn: columnName
			})
			taskData = { ...taskData, column }
		} else {
			const column = head (board.columns)
			taskData = { ...taskData, column }
		}
		
		const swimlane = ({ swimlanes }: Board, name: string): Swimlane => {
			if (name) {
				const present = find (c => c.name === name, swimlanes)
				if (!present) throw new ApolloError
				(`Swimlane <${name}> doesn't exist on board <${boardName}>`, ErrorCodes2.NOT_FOUND, {
					requestedSwimlane: name
				})
				return present
			}
			return head (swimlanes)!
		}
		if (swimlaneName) {
			const swimlane = find
			(c => c.name === swimlaneName, board.swimlanes)
			if (!swimlane) throw new ApolloError
			(`Swimlane <${swimlaneName}> doesn't exist on board <${boardName}>`, ErrorCodes2.NOT_FOUND, {
				requestedSwimlane: swimlaneName
			})
			taskData = { ...taskData, swimlane }
		} else {
			const swimlane = head (board.swimlanes)
			taskData = { ...taskData, swimlane }
		}
		
		if (dates) {
		
		}
		
		
		return await Task.create ({
			...rest, ...taskData
		}).save ()
	}
	
}

