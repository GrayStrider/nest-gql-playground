import { Field } from '@nestjs/graphql'
import { Column, ManyToMany, ManyToOne, JoinTable } from 'typeorm'
import { User } from '@M/KBF/entity/User'
import { Task } from '@M/KBF/entity/Task'
import { Base } from '@M/KBF/entity/_Base'
import { EntityObject } from '@/common/decorators'


@EntityObject
export class Subtask extends Base {
	@Column ()
	@Field ()
	content: string
	
	@Field ()
	@Column ({ type: 'bool', default: false })
	finished: boolean
	
	@Field (returns => Date, { nullable: true })
	@Column ({ type: 'date', nullable: true })
	dueDateTimestamp?: string
	
	@Field (returns => Date, { nullable: true })
	@Column ({ type: 'date', nullable: true })
	dueDateTimestampLocal?: string
	
	@Field (returns => [User], { nullable: true })
	@ManyToMany (type => User, user => user.subtasks)
	@JoinTable ()
	user?: User[]
	
	@Field (returns => Task)
	@ManyToOne (type => Task)
	parent: Task
	
}

