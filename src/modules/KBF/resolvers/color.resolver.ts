import { Resolver, Args, Mutation } from '@nestjs/graphql'
import { Color } from '@M/KBF/entity/Color'
import { NewColorInput } from '@M/KBF/inputs/color.input'
import { find } from 'ramda'
import { getBoard } from '@M/KBF/resolvers/task.resolver'
import Errors from '@/common/errors'

@Resolver ()
export class ColorResolver {
	@Mutation (returns => Color)
	async addColor (
		@Args ('data')
			{ boardName, name, ...rest }: NewColorInput
	): Promise<Color> {
		
		const board = await getBoard (boardName)
		
		if (find (c => c.name === name, board.colors))
			throw new Errors.NotUnique
			(`Color name <${name}> already exists`, { name })
		
		if (rest.default === true) {
			board.colors.forEach ((c, i, a) => a[i].default = false)
			await Color.save (board.colors)
			
		}
		
		return Color.create
		({ board, name, ...rest }).save ()
		
	}
	
}
