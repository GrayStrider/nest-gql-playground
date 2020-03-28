import { Field } from '@nestjs/graphql'
import { OneToOne, Column } from 'typeorm'
import { Task } from '@M/KBF/entity/Task'
import { Base } from '@M/KBF/entity/_Base'
import { EntityObject } from '@/common/decorators'


@EntityObject
export class TaskNumber extends Base {
	@Field ()
	@Column ({ type: 'int' })
	value: number
	
	@Field ()
	@Column ()
	prefix?: string
	
	@OneToOne (type => Task)
	task: Task
	
}

