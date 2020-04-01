import { Field } from '@nestjs/graphql'
import { OneToOne, Column, Check } from 'typeorm'
import { Task } from '@M/kanban/entity/Task'
import { Base } from '@M/kanban/entity/_Base'
import { EntityObject } from '@/common/decorators/entity-object.decorator'


@EntityObject
@Check (`"value" < 1000000`)
@Check (`"value" >= 0`)
export class TaskNumber extends Base {
	@Field ()
	@Column ({ type: 'int' })
	value: number
	
	@Field ()
	@Column ({ length: 3, nullable: true })
	prefix?: string
	
	@OneToOne (type => Task,
		task => task.number)
	task: Task
	
}

