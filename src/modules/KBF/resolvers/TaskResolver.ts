import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import * as RD from 'ramda-adjunct'
import { SearchTaskInput } from '@M/KBF/inputs/SearchTaskInput'
import { Task } from '@M/KBF/entity/Task'
import WrapperLike from '@M/db/utils/wrapper.like'
import { NewTaskInput } from '@M/KBF/inputs/NewTaskInput'
import { Promise as bb } from 'bluebird'
import { DeepPartial } from 'typeorm'
import { Label } from '@M/KBF/entity/Label'

@Resolver ()
export class TaskResolver {
	@Query (returns => [Task])
	async tasks (@Args () { tag, ...params }: SearchTaskInput) {
		
		return Task.find ({
			where: RD.isNotNil (params.title)
				? WrapperLike (params, 'title')
				: RD.isNotNil (params.description)
					? WrapperLike (params, 'description')
					: RD.isNotNil (tag)
						? { ...params }
						: params
		})
		
	}
	
	@Mutation (returns => Task)
	async taskCreate (@Args () { tags: tagNames, ...data }: NewTaskInput) {
		
		if (RD.isNotNilOrEmpty (tagNames)) {
			
			const labels = await bb.reduce (
				tagNames, async (acc: Array<DeepPartial<Label>>, name) => {
					
					const getTag = await Label.findOne ({ name }) ??
						Label.create ({ name })
					return [...acc, getTag]
					
				}, []
			)
			
			return Task.create ({ ...data, labels })
			
		}
		
		return Task.create (data).save ()
		
	}
	
}

