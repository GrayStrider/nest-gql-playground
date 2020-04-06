import { Column, ManyToOne, CreateDateColumn } from 'typeorm'
import { Field } from '@nestjs/graphql'
import { Task } from '@M/kanban/entity/Task'
import { User } from '@M/kanban/entity/User'
import { Base } from '@M/kanban/entity/_Base'
import { EntityObject } from '@/common/decorators/entity-object.decorator'

export const textLength = 5000

@EntityObject
export class TaskComment extends Base {
	@Field ()
	@Column ({ length: textLength })
	text: string
	
	@Field (returns => User)
	@ManyToOne (type => User, user => user.comments,
		{ eager: true })
	user: User
	
	@Field (returns => Date)
	@CreateDateColumn ()
	createdTimestamp: Date
	
	@Field (returns => Task)
	@ManyToOne (type => Task, task => task.comments,
		{ eager: true })
	task: Task
}
