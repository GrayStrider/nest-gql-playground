import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { Tag } from '@M/kanban/entity/Tag'
import { TagInput } from '@M/kanban/inputs/tag.input'
import { Task } from '@M/kanban/entity/Task'
import { without, isEmpty } from 'ramda'
import Errors, { NotFoundByIDError } from '@/common/errors'
import { getBoard } from '@M/kanban/resolvers/task.resolver'
import { toDefault } from '@qdev/utils-ts'

@Resolver ()
export class TagResolver {
	@Query (returns => [Tag])
	async tags (@Args ('searchBy', { nullable: true }) data: TagInput): Promise<Tag[]> {
		return Tag.find ()
	}
	
	@Mutation (returns => Tag)
	async addTag (@Args ('data') data: TagInput): Promise<Tag> {
		const { tasksIDs, boardName, name, ...rest } = data
		const board = await getBoard (boardName)
		
		toDefault (
			!await Tag.findOne ({ name, board }),
			new Errors.NotUnique (`Tag with the name <${name}> already exists on the board: <${boardName}>`,
				{ boardName, name }))
		
		const tasks = await getTasks (tasksIDs)
		
		return Tag.create ({ name, board, tasks, ...rest }).save ()
		
	}
}

async function getTasks (lookupIDs: string[]) {
	const tasks = await Task.findByIds (lookupIDs)
	const notFound = without (tasks.map (t => t.id), lookupIDs)
	if (!isEmpty (notFound)) {
		throw NotFoundByIDError ('tasks',
			notFound.join (', '))
	}
	return tasks
}
