import { Field } from '@nestjs/graphql'
import { OneToMany, Column, ManyToOne, Unique } from 'typeorm'
import { Task } from '@M/KBF/entity/Task'
import { Board } from '@M/KBF/entity/Board'
import { Base } from '@M/KBF/entity/_Base'
import { EntityObject } from '@/common/decorators'

export const nameLength = 20
export const descriptionLength = 20

@Unique (['name', 'board'])
@EntityObject
export class Color extends Base {
	@Field ()
	@Column ({ length: nameLength })
	name: string
	
	@OneToMany (type => Task, task => task.color)
	tasks: Task[]
	
	@Field ({ nullable: true })
	@Column ({
		nullable: true,
		length: descriptionLength
	})
	description?: string
	
	@Field ()
	@Column ({ length: 6 })
	value: string
	
	@Field ()
	@Column ({ default: false, type: 'bool' })
	default: boolean
	
	@ManyToOne (type => Board, board => board.colors)
	board: Board
	
}

