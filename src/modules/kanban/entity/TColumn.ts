import { OneToMany, ManyToOne, Column, Check } from 'typeorm'
import { Field } from '@nestjs/graphql'
import { Board } from '@M/kanban/entity/Board'
import { Task } from '@M/kanban/entity/Task'
import { Base } from '@M/kanban/entity/_Base'
import { EntityObject } from '@/common/decorators/entity-object.decorator'

export const nameLength = 20
export const maxOrder = 5000
export const taskLimit = 100000

export const defaultColumns: [string, number, number][] = [
	['To-do', 0, 0],
	['Do today', 1, 0],
	['In progress', 2, 3],
	['Done', 3, 0]
]

// TODO unique name per board (to use name as id)
@EntityObject
@Check (`"order" < ${maxOrder}`)
@Check (`"order" >= 0`)
@Check (`"taskLimit" < ${taskLimit}`)
@Check (`"taskLimit" >= 0`)
export class TColumn extends Base {
	@Column ({ length: nameLength })
	@Field ()
	name: string
	
	@Field ()
	@Column ({ type: 'int', default: 0 })
	order: number
	
	@Field ()
	@Column ({ type: 'int', default: 0 })
	taskLimit: number
	
	@OneToMany (type => Task, task => task.column)
	tasks: Task[]
	
	@ManyToOne (type => Board, board => board.columns)
	board: Board
	
}

