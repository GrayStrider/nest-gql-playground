import { Column, ManyToMany, ManyToOne, Unique } from 'typeorm'
import { Field } from '@nestjs/graphql'
import { Task } from '@M/kanban/entity/Task'
import { Base } from '@M/kanban/entity/_Base'
import { EntityObject } from '@/common/decorators/entity-object.decorator'
import { Board } from '@M/kanban/entity/Board'

export const nameLength = 20
export const descriptionLength = 100

@EntityObject
@Unique (['name', 'board'])
export class Tag extends Base {
	@ManyToOne (type => Board,
		board => board.tags)
	board: Board
	
	@Column ({ length: nameLength })
	@Field ()
	name: string
	
	@Column ({
		length: descriptionLength,
		nullable: true
	})
	@Field ({ nullable: true })
	description?: string
	
	@Field ()
	@Column ({ type: 'bool', default: false })
	pinned: boolean
	
	@ManyToMany (type => Task, task => task.tags)
	tasks: Task[]
}

