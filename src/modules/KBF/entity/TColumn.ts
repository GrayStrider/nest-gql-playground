import { OneToMany, ManyToOne, Column, Check } from 'typeorm'
import { Field } from '@nestjs/graphql'
import { Board } from '@M/KBF/entity/Board'
import { Task } from '@M/KBF/entity/Task'
import { Base } from '@M/KBF/entity/_Base'
import { EntityObject } from '@/common/decorators'

export const nameLength = 20
export const maxOrder = 5000
export const taskLimit = 100000

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
