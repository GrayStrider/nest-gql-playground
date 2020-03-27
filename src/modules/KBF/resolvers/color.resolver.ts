import { Resolver, Args, Mutation, Query } from '@nestjs/graphql'
import { Color } from '@M/KBF/entity/Color'
import { Board } from '@M/KBF/entity/Board'
import { ApolloError } from 'apollo-server-errors'
import { ErrorCodes } from '@M/KBF/resolvers/task.resolver'
import { NewColorInput } from '@M/KBF/inputs/color.input'
import { find } from 'ramda'

@Resolver ()
export class ColorResolver {
	@Mutation (returns => Color)
	async addColor (
		@Args ('data')
			{ boardName, ...rest }: NewColorInput
	): Promise<Color> {
		
		const board = await Board.findOne ({ name: boardName })
		if (!board) throw new ApolloError (`Board <${boardName}> not found`, ErrorCodes.NOT_FOUND,
			{
				requestedName: boardName
			})
		
		const isDuplicate = find
		(c => c.name === rest.name, board.colors)
		
		if (isDuplicate) throw new ApolloError
		(`Color name <${name}> already exists`)
		
		if (rest.default === true) {
			board.colors.forEach ((c, i, a) => a[i].default = false)
			await Color.save (board.colors)
			
		}
		
		return Color.create
		({ board, ...rest }).save ()
		
	}
	
}
