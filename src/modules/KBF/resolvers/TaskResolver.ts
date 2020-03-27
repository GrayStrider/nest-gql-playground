import { Resolver, Args, Mutation } from '@nestjs/graphql'
import { Task } from '@M/KBF/entity/Task'
import { NewTaskInput } from '@M/KBF/inputs/NewTaskInput'
import { Promise as bb } from 'bluebird'
import { Label } from '@M/KBF/entity/Label'
import { Color } from '@M/KBF/entity/Color'
import { NotFoundException } from '@nestjs/common'
import { DeepPartial, BaseEntity } from 'typeorm'
import { ApolloError } from 'apollo-server-errors'

export enum ErrorCodes {
	LIMIT_REACHED = 'LIMIT_REACHED'
}

export const MAX_TASK_NUMBER = 3

export const checkIfMaxReached =
	async <C extends typeof BaseEntity>
	(numberOf: string, entity: C, max: number) => {
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
	@Mutation (returns => Task)
	async addTask (
		@Args ('data') { tags: tagNames, ...data }: NewTaskInput)
		: Promise<Task> {
		
		await checkIfMaxReached ('tasks',
			Task, MAX_TASK_NUMBER)
		
		
		if (tags) {
			const tags_ = await bb.reduce (
				tags, async (acc: Label[], name) => {
					const getTag = await Label.findOne ({ name })
						?? Label.create ({ name })
					return acc.concat (getTag)
					
				}, []
			)
			
			return Task.create ({ ...data, labels }).save ()
		}
		
		return Task.create (data).save ()
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
	
	// @Mutation (returns => Task)
	// async taskCreate_ (@Args () { tags: tagNames, ...data }: NewTaskInput) {
	//
	// 	if (RD.isNotNilOrEmpty (tagNames)) {
	//
	// 		const labels = await bb.reduce (
	// 			tagNames, async (acc: Array<DeepPartial<Label>>, name) => {
	//
	// 				const getTag = await Label.findOne ({ name }) ??
	// 					Label.create ({ name })
	// 				return [...acc, getTag]
	//
	// 			}, []
	// 		)
	//
	// 		return Task.create ({ ...data, labels })
	//
	// 	}
	//
	// 	return Task.create (data).save ()
	//
	// }
	
}

