import { Field } from '@nestjs/graphql'
import { OneToMany, Column, ManyToOne, Unique } from 'typeorm'
import { Task } from '@M/kanban/entity/Task'
import { Board } from '@M/kanban/entity/Board'
import { Base } from '@M/kanban/entity/_Base'
import { EntityObject } from '@/common/decorators/entity-object.decorator'

export const nameLength = 20
export const descriptionLength = 20

export const defaultColors: [string, string, boolean][] = [
	['White', 'FDFFFC', true],
	['Green', '2EC4B6', false],
	['Blue', '011627', false],
	['Orange', 'FF9F1C', false],
	['Red', '71D36', false]
]

@Unique (['name', 'board'])
@EntityObject
export class TaskColor extends Base {
	@Field ()
	@Column ({ length: nameLength })
	name: string
	
	@OneToMany (type => Task,
			task => task.color)
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
	
	@ManyToOne (type => Board,
			board => board.colors)
	board: Board
	
}

