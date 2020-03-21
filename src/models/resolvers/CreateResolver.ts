import { Resolver, Mutation, Args } from '@nestjs/graphql'
import { DeepPartial } from 'typeorm'
import { Promise as bb } from 'bluebird'
import * as RD from 'ramda-adjunct'
import { NewTaskInput } from '@/models/inputs/NewTaskInput'
import { Label } from '@/models/entity/Label'
import { Task } from '@/models/entity/Task'

@Resolver ()
export class CreateResolver {
	
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

