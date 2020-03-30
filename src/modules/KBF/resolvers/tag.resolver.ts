import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { Tag } from '@M/KBF/entity/Tag'
import { TagInput } from '@M/KBF/inputs/tag.input'
import { Task } from '@M/KBF/entity/Task'
import { without, isEmpty } from 'ramda'
import { NotFoundByIDError, ErrorCodes2 } from '@/common/errors'
import { Board } from '@M/KBF/entity/Board'
import { ApolloError } from 'apollo-server-errors'

@Resolver ()
export class TagResolver {
	@Query (returns => [Tag])
	async tags (@Args ('searchBy', { nullable: true }) data: TagInput): Promise<Tag[]> {
		return Tag.find ()
	}
	
	@Mutation (returns => Tag)
	async addTag (@Args ('data') data: TagInput): Promise<Tag> {
		const { tasksIDs, boardName, name, ...rest } = data
		const board = await Board.findOne ({ name: boardName })
		if (!board) {
			throw new ApolloError (`Board <${boardName}> not found`, ErrorCodes2.NOT_FOUND,
				{
					requestedName: boardName
				})
		}
		
		const exists = await Tag.find ({ name, board })
		if (!isEmpty (exists)) {
			throw new ApolloError (`Tag with the name <${name}> already exists: <${exists[0].id}>`,
				ErrorCodes2.NOT_UNIQUE,
				{ existingEntityID: exists[0].id })
		}
		
		if (tasksIDs) {
			const tasks = await Task.findByIds (tasksIDs)
			const notFound = without (tasks.map (t => t.id), tasksIDs)
			if (!isEmpty (notFound)) {
				throw NotFoundByIDError ('task', notFound[0])
			}
			return Tag.create ({ name, board, tasks, ...rest }).save ()
		}
		
		return Tag.create ({ name, board, ...rest }).save ()
		
	}
}
