import { Resolver, Args, Mutation } from '@nestjs/graphql'
import { Task } from '@M/KBF/entity/Task'
import { NewTaskInput } from '@M/KBF/inputs/NewTaskInput'
import { Promise as bb } from 'bluebird'
import { Label } from '@M/KBF/entity/Label'
import { isNonEmpty } from 'fp-ts/lib/Array'


@Resolver ()
export class TaskResolver {
	@Mutation (returns => Task)
	async addTask (
		@Args ('data') { tags: tagNames, ...data }: NewTaskInput)
		: Promise<Task> {
		if (tagNames && isNonEmpty (tagNames)) {
			const labels = await bb.reduce (
				tagNames, async (acc: Label[], name) => {
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

