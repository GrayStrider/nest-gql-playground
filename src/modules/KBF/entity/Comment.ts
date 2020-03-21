import { PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, BaseEntity, Entity } from 'typeorm'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Task } from '@M/KBF/entity/Task'
import { User } from '@M/KBF/entity/User'

@ObjectType ()
@Entity ()

export class Comment extends BaseEntity {
	
	@Field (returns => ID)
	@PrimaryGeneratedColumn ('uuid')
	id: string
	
	@Field ()
	@Column ({ length: 5000 })
	text: string
	
	@Field (returns => User)
	@ManyToOne (type => User, user => user.comments)
	author: string
	
	@Field (returns => Date)
	@CreateDateColumn ()
	createdTimestamp: Date
	
	@Field (returns => Task)
	@ManyToOne (type => Task, task => task.comments)
	task: Task
	
}
