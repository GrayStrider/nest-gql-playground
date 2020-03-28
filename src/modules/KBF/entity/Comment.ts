import { Column, ManyToOne, CreateDateColumn } from 'typeorm'
import { Field } from '@nestjs/graphql'
import { Task } from '@M/KBF/entity/Task'
import { User } from '@M/KBF/entity/User'
import { Base } from '@M/KBF/entity/_Base'
import { EntityObject } from '@/common/decorators'


@EntityObject
export class Comment extends Base {
	@Field ()
	@Column ({ length: 5000 })
	text: string
	
	@Field (returns => User)
	@ManyToOne (type => User, user => user.comments)
	author: User
	
	@Field (returns => Date)
	@CreateDateColumn ()
	createdTimestamp: Date
	
	@Field (returns => Task)
	@ManyToOne (type => Task, task => task.comments)
	task: Task
	
}
