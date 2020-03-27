import { Resolver, Args, Mutation, Query } from '@nestjs/graphql'
import { Task } from '@M/KBF/entity/Task'
import { NewTaskInput } from '@M/KBF/inputs/NewTaskInput'
import { Promise as bb } from 'bluebird'
import { Label } from '@M/KBF/entity/Label'
import { DeepPartial, BaseEntity } from 'typeorm'
import { ApolloError } from 'apollo-server-errors'
import { Board } from '@M/KBF/entity/Board'
import { find } from 'ramda'

export enum ErrorCodes {
	LIMIT_REACHED = 'LIMIT_REACHED',
	NOT_FOUND = 'NOT_FOUND',
}

export const MAX_TASK_NUMBER = 3

export const checkIfMaxReached =
	async <C extends typeof BaseEntity>
	(numberOf: string, entity: C, max = 10.000) => {
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

@Resolver ()
export class TaskResolver {
	@Query(returns => [Task])
	async tasks () {
		return Task.find()
	}
	
	@Mutation (returns => Task)
	async addTask (
		@Args ('data') { tags, colorName, boardName, ...rest }: NewTaskInput)
		: Promise<Task> {
		
		let taskData: DeepPartial<Task> = {}
		
		const board = await Board.findOne ({name: boardName})
		if (!board) throw new ApolloError (`Board <${boardName}> not found`, ErrorCodes.NOT_FOUND,
			{
				requestedName: boardName
			})
		taskData = { ...taskData, board }
		if (colorName) {
			const color = find (c => c.name === colorName,
				board.colors)
			
			if (!color) throw new ApolloError
			(`Color <${colorName}> doesn't exist on board <${boardName}>`, ErrorCodes.NOT_FOUND, {
				requestedColor: colorName
			})
			taskData = { ...taskData, color }
		
		} else {
			
			const color = find(c => c.default, board.colors)
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

