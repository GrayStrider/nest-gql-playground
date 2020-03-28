import { ObjectType, Field, ID } from '@nestjs/graphql'
import { Entity, OneToOne, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm'
import { Task } from '@M/KBF/entity/Task'
import { Base } from '@M/KBF/entity/_Base'

@ObjectType ()
@Entity ()
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

