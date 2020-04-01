import { Field } from '@nestjs/graphql'
import { Column, ManyToMany, ManyToOne, JoinTable } from 'typeorm'
import { User } from '@M/KBF/entity/User'
import { Task } from '@M/KBF/entity/Task'
import { Base } from '@M/KBF/entity/_Base'
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
	@ManyToMany (type => User, user => user.subtasks)
	@JoinTable ()
	user: User[]
	
	@Field (returns => Task)
	@ManyToOne (type => Task,
		task => task.subtasks)
	parent: Task
	
}

