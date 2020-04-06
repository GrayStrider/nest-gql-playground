import { Resolver, Args, Mutation } from '@nestjs/graphql'
import { TaskColor } from '@M/kanban/entity/TaskColor'
import { NewColorInput } from '@M/kanban/inputs/color.input'
import { find } from 'ramda'
import { getBoard } from '@M/kanban/resolvers/task.resolver'
import Errors from '@/common/errors'

@Resolver ()
export class ColorResolver {
	@Mutation (returns => TaskColor)
	async addColor (
		@Args ('data')
			{ boardName, name, ...rest }: NewColorInput
	): Promise<TaskColor> {
		
		const board = await getBoard (boardName)
		
		if (find (c => c.name === name, board.colors))
			throw new Errors.NotUnique
			(`Color name <${name}> already exists`, { name })
		
		if (rest.default === true) {
			board.colors.forEach ((c, i, a) => a[i].default = false)
			await TaskColor.save (board.colors)
		}
		
		return TaskColor.create ({ board, name, ...rest }).save ()
		
	}
	
}
