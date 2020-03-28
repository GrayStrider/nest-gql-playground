import { OneToMany, ManyToOne, Column } from 'typeorm'
import { Field } from '@nestjs/graphql'
import { Task } from '@M/KBF/entity/Task'
import { Board } from '@M/KBF/entity/Board'
import { Base } from '@M/KBF/entity/_Base'
import { EntityObject } from '@/common/decorators'


@EntityObject
export class Swimlane extends Base {
	@Column ()
	@Field ()
	name: string
	
	@Column ({ nullable: true })
	@Field ({ nullable: true })
	description: string
	
	
	@OneToMany (type => Task, task => task.swimlane)
	tasks: Task[]
	
	@ManyToOne (type => Board, board => board.swimlanes)
	board: Board
	
}

