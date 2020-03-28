import { Field } from '@nestjs/graphql'
import { OneToMany, Column, ManyToOne, Unique } from 'typeorm'
import { Task } from '@M/KBF/entity/Task'
import { Board } from '@M/KBF/entity/Board'
import { Base } from '@M/KBF/entity/_Base'
import { EntityObject } from '@/common/decorators'


@Unique (['name', 'board']) // Actually works
@EntityObject
export class Color extends Base {
	@Field ()
	@Column ()
	name: string
	
	@OneToMany (type => Task, task => task.color)
	tasks: Task[]
	
	@Field ({ nullable: true })
	@Column ({ nullable: true })
	description?: string
	
	@Field ()
	@Column ()
	value: string
	
	@Field ()
	@Column ({ default: false })
	default: boolean
	
	@ManyToOne (type => Board, board => board.colors)
	board: Board
	
}

