import { Field } from '@nestjs/graphql'
import { OneToOne, Column, Check } from 'typeorm'
import { Task } from '@M/KBF/entity/Task'
import { Base } from '@M/KBF/entity/_Base'
import { EntityObject } from '@/common/decorators'


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

