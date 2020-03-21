import { Resolver, Query, Args } from '@nestjs/graphql'
import { LikeWrapper } from '@/DB/typeorm'
import * as RD from 'ramda-adjunct'
import { SearchTaskInput } from '@/models/inputs/SearchTaskInput'
import { Task } from '@/models/entity/Task'

@Resolver ()
export class TasksResolver {
	
	@Query (returns => [Task])
	async tasks (@Args () { tag, ...params }: SearchTaskInput) {
		
		return Task.find ({
			where: RD.isNotNil (params.title)
				? LikeWrapper (params, 'title')
				: RD.isNotNil (params.description)
					? LikeWrapper (params, 'description')
					: RD.isNotNil (tag)
						? { ...params }
						: params
		})
		
	}
	
}

