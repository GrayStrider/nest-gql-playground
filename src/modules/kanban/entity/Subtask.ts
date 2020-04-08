import { Field } from '@nestjs/graphql'
import { Column, ManyToMany, ManyToOne, JoinTable } from 'typeorm'
import { User } from '@M/kanban/entity/User'
import { Task } from '@M/kanban/entity/Task'
import { Base } from '@M/kanban/entity/_Base'
import { EntityObject } from '@/common/decorators/entity-object.decorator'

export const contentLength = 500

@EntityObject
export class Subtask extends Base {
	@Field ()
	@Column ({ length: contentLength })
	content: string
	
	@Field ()
	@Column ({ default: false, type: 'bool' })
	finished: boolean
	
	@Field (returns => Date,
		{ nullable: true })
	@Column ({ type: 'date', nullable: true })
	dueDateTimestamp?: string
	
	@Field (returns => [User])
	@ManyToMany (type => User,
		user => user.collaboratingAtSubtasks)
	@JoinTable ()
	collaborators: User[]
	
	@Field (returns => User,
		{ nullable: true })
	@ManyToOne (
		type => User,
		user => user.responsibleForSubtasks,
		{ nullable: true, eager: true })
	responsible: User
	
	@Field (returns => Task)
	@ManyToOne (type => Task,
		task => task.subtasks,
		{ nullable: false })
	parent: Task
	
}

