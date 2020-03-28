import { Resolver, Args, Mutation, Query } from '@nestjs/graphql'
import { Task } from '@M/KBF/entity/Task'
import { TaskInput } from '@M/KBF/inputs/task.input'
import { Promise as bb } from 'bluebird'
import { Label } from '@M/KBF/entity/Label'
import { DeepPartial, BaseEntity } from 'typeorm'
import { ApolloError } from 'apollo-server-errors'
import { Board } from '@M/KBF/entity/Board'
import { find, head } from 'ramda'
import { SearchByIDInput } from '@M/KBF/inputs/search-by-id.input'

export enum ErrorCodes2 {
	LIMIT_REACHED = 'LIMIT_REACHED',
	NOT_FOUND = 'NOT_FOUND',
	VALIDATION_ERROR = 'VALIDATION_ERROR'
}

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
	async tasks (@Args('searchBy') args: TaskInput) {
		return Task.find (args)
	}
	
	@Query(returns => Task)
	async task (@Args() args: SearchByIDInput) {
		return Task.findOne(args)
	}
	
	@Mutation (returns => Task)
	async addTask (
		@Args ('data') {
			tags, colorName, columnName, swimlaneName,
			boardName, ...rest
		}: TaskInput)
		: Promise<Task> {
		
		let taskData: DeepPartial<Task> = {}
		
		const board = await Board.findOne ({ name: boardName })
		if (!board) {
			throw new ApolloError (`Board <${boardName}> not found`, ErrorCodes2.NOT_FOUND,
				{
					requestedName: boardName
				})
		} else {
			taskData = { ...taskData, board }
		}
		
		if (colorName) {
			const color = find (c => c.name === colorName,
				board.colors)
			
			if (!color) throw new ApolloError
			(`Color <${colorName}> doesn't exist on board <${boardName}>`, ErrorCodes2.NOT_FOUND, {
				requestedColor: colorName
			})
			taskData = { ...taskData, color }
			
		} else {
			const color = find (c => c.default, board.colors)
			taskData = { ...taskData, color }
		}
		
		if (tags) {
			const tags_ = await bb.reduce (
				tags, async (acc: Label[], name) => {
					const getTag = await Label.findOne ({ name })
						?? Label.create ({ name })
					return acc.concat (getTag)
					
				}, []
			)
			
			taskData = { ...taskData, labels: tags_ }
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
		
		
		return await Task.create ({
			...rest, ...taskData
		}).save ()
	}
	
	// @Query (returns => [Task])
	// async tasks_
	// (@Args () { tag, ...params }: SearchTaskInput) {
	//
	// 	return Task.find ({
	// 		where: RD.isNotNil (params.title)
	// 			? WrapperLike (params, 'title')
	// 			: RD.isNotNil (params.description)
	// 				? WrapperLike (params, 'description')
	// 				: RD.isNotNil (tag)
	// 					? { ...params }
	// 					: params
	// 	})
	//
	// }
	
}

