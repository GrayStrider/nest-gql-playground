import { OneToMany, ManyToOne, Column, Check } from 'typeorm'
import { Field } from '@nestjs/graphql'
import { Task } from '@M/kanban/entity/Task'
import { Board } from '@M/kanban/entity/Board'
import { Base } from '@M/kanban/entity/_Base'
import { EntityObject } from '@/common/decorators/entity-object.decorator'

export const nameLength = 20
export const descriptionLength = 500

export class Board_Swimlane extends Base {

}

// TODO unique name per board (to use name as id)
@EntityObject
@Check (`"order" < ${10000}`)
@Check (`"order" >= 0`)
export class Swimlane extends Board_Swimlane {
	@Column ({ length: nameLength })
	@Field ()
	name: string
	
	@Column ({
		nullable: true,
		length: descriptionLength
	})
	@Field ({ nullable: true })
	description?: string
	
	@Field ()
	@Column ({ type: 'int', default: 0 })
	order: number
	
	@OneToMany (type => Task, task => task.swimlane)
	tasks: Task[]
	
	@ManyToOne (type => Board, board => board.swimlanes)
	board: Board
	
}

