import { ObjectType } from '@nestjs/graphql'
import { ManyToOne } from 'typeorm'
import { Base } from '@M/kanban/entity/_Base'
import { Board } from '@M/kanban/entity/Board'

// ManyToOne
export function boardMember (reverseKey: keyof Board) {
	@ObjectType (`Board_${reverseKey}`, { isAbstract: true })
	abstract class BoardMember extends Base {
		@ManyToOne (type => Board,
			board => board[reverseKey], { nullable: false })
		board: Board
	}
	
	return BoardMember
}
